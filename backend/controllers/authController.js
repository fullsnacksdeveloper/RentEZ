const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { createUserService, getUserByEmail } = require("../models/authModel");
const { handleResponse } = require("../utils/handleResponse");
const { isValidEmail } = require("../utils/validators");

const pool = require("../db");

const JWT_SECRET = process.env.JWT_SECRET;

// User Registration
const VALID_userTypeS = ['tenant', 'landlord', 'admin'];

// Create tenant or landlord account
const createUser = async (req, res, next) => {
  {/*const {
    email, password, userType,
    firstName, lastName, dob,
    credit_score, annual_income, phone, bio
  } = req.body;*/}

  const {
    email, password, userType,
    firstName, lastName, phone
  } = req.body;

  console.log("Received registration body:", req.body);

  try {
    if (!email || !password || !userType|| !firstName || !lastName) {
      return handleResponse(res, 400, "Missing required fields.");
    }

    if (!isValidEmail(email)) {
      return handleResponse(res, 400, "Invalid email format.");
    }

    if (!['tenant', 'landlord'].includes(userType)) {
      return handleResponse(res, 400, "User type must be either 'tenant' or 'landlord'");
    }

    const passwordHash = await bcrypt.hash(password, 10);
   

    const newUser = await createUserService({
      email,
      password: passwordHash,
      role:userType,
      first_name:firstName,
      last_name:lastName,
      phone
    });

    //handleResponse(res, 201, "User registration successful", newUser);
    const token = jwt.sign(
    { id: newUser.id, userType: newUser.role},
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        firstName: newUser.first_name,
        lastName: newUser.last_name
      }
    });

  } catch (err) {
    next(err);
  }
}; 

// Admin Creation
const createAdmin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return handleResponse(res, 400, "Email and password are required");
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const adminUser = await createUserService({
      email,
      password: passwordHash,
      userType: 'admin'
    });

    handleResponse(res, 201, "Admin account created", adminUser);
  } catch (err) {
    next(err);
  }
};

// Login
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      console.log("❌ User not found:", email);
      return handleResponse(res, 404, "User not found");
    }

    console.log("🔐 Login attempt for:", email);
    console.log("⬅️ Raw entered password:", password);
    console.log("🧾 Stored hash from DB:", user.password_hash);


    const passwordMatch = await bcrypt.compare(password, user.password_hash);

     console.log("✅ Password match result:", passwordMatch);


    if (!passwordMatch) {
      return handleResponse(res, 401, "Incorrect passwords");
    }

    const token = jwt.sign(
      { user_id: user.user_id, userType: user.userType },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    user.password_hash = undefined;

    
    user.userType = user.role;
    delete user.role; // optional


    handleResponse(res, 200, "Login successful", {
      token,
      //userType: user.userType
      user
    });
  } catch (err) {
    next(err);
  }
};

// Get User Profile (Tenant or Landlord)
/*const getUserProfile = async (req, res, next) => {
  const userId = req.user.user_id;
  const userType = req.user.role;

  try {
    const userQuery = await pool.query(
      `SELECT user_id, email, role AS userType, created_at FROM users WHERE user_id = $1`,
      [userId]
    );
    const user = userQuery.rows[0];

    if (!user) return handleResponse(res, 404, 'User not found');

    let profile = {};

    if (userType === 'tenant') {
      const tenantQuery = await pool.query(
        `SELECT * FROM tenants WHERE tenant_id = $1`,
        [userId]
      );
      profile = tenantQuery.rows[0];
    } else if (userType === 'landlord') {
      const landlordQuery = await pool.query(
        `SELECT * FROM landlords WHERE landlord_id = $1`,
        [userId]
      );
      profile = landlordQuery.rows[0];
    }

    return handleResponse(res, 200, 'User profile retrieved', {
      ...user,
      ...profile
    });
  } catch (err) {
    next(err);
  }
};
*/

const getUserProfile = async (req, res, next) => {
  const userId = req.user.user_id;
  const userType = req.user.role;

  try {
    const userQuery = await pool.query(
      `SELECT user_id, email, role AS userType, created_at FROM users WHERE user_id = $1`,
      [userId]
    );
    const user = userQuery.rows[0];

    if (!user) return handleResponse(res, 404, 'User not found');

    let profile = {};

    if (userType === 'tenant') {
      const result = await pool.query(
        'SELECT * FROM tenant_profiles WHERE user_id = $1',
        [userId]
      );
      profile = result.rows[0];
    } else if (userType === 'landlord') {
      const result = await pool.query(
        'SELECT * FROM landlord_profiles WHERE user_id = $1',
        [userId]
      );
      profile = result.rows[0];
    }

    // Attach profile details to user object
    user.profile = profile;

    // ✅ FIX: wrap response
    return res.status(200).json({ user });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return handleResponse(res, 500, 'Internal server error');
  }
};

module.exports = {
  createUser,
  createAdmin,
  loginUser,
  getUserProfile
};

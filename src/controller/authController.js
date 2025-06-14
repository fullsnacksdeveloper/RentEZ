import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { createUserService,getUserByEmail} from "../models/authModel.js";
import { handleResponse } from '../utils/handleResponse.js';
import { isValidEmail } from '../utils/validators.js';

const JWT_SECRET = process.env.JWT_SECRET;


//User Registration
const VALID_ROLES = ['tenant', 'landlord', 'admin'];

//Create tenant or landlord account
export const createUser = async (req, res, next) => {
    const { email, password, role, 
        first_name, last_name,dob, 
        credit_score, annual_income, phone, bio 
    }= req.body;
    try {
        if (!email || !password || !role || !first_name || !last_name) {
            return handleResponse(res, 400, "Missing required fields.");
        }

        if (!isValidEmail(email)) {
            return handleResponse(res, 400, "Invalid email format.");
        }

        if (!['tenant', 'landlord'].includes(role)) {
            return handleResponse(res, 400, "Role must be either 'tenant' or 'landlord'");
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await createUserService  ({
      email, password, role, first_name, last_name,
      dob, credit_score, annual_income, phone, bio
    });
        handleResponse(res, 201, "User registration successful", newUser);
    } catch (err) {
        next(err);
    }
};
    
//Admin Creation
export const createAdmin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return handleResponse(res, 400, "Email and password are required");
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const adminUser = await createUserService({ email, password: passwordHash, role: 'admin' });
        handleResponse(res, 201, "Admin account created", adminUser);
    } catch (err) {
        next(err);
    }
};
   

//Login
export const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await getUserByEmail(email);

        if (!user) {
            return handleResponse(res, 404, "User not found");
        }

        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            return handleResponse(res, 401, "Incorrect passwords");
        }

        const token = jwt.sign(
            { user_id: user.user_id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );
        user.password_hash = undefined;

        handleResponse(res, 200, "Login successful", { token, role: user.role });
    } catch (err) {
        next(err);
    }
};



//Get Profile-from landlord or tenant table
export const getUserProfile = async (req, res, next) => {
  const userId = req.user.user_id;
  const role = req.user.role;

  try {
    const userQuery = await pool.query(`SELECT user_id, email, role, created_at FROM users WHERE user_id = $1`, [userId]);
    const user = userQuery.rows[0];

    if (!user) return handleResponse(res, 404, 'User not found');

    let profile = {};

    if (role === 'tenant') {
      const tenantQuery = await pool.query(`SELECT * FROM tenants WHERE tenant_id = $1`, [userId]);
      profile = tenantQuery.rows[0];
    } else if (role === 'landlord') {
      const landlordQuery = await pool.query(`SELECT * FROM landlords WHERE landlord_id = $1`, [userId]);
      profile = landlordQuery.rows[0];
    }

    return handleResponse(res, 200, 'User profile retrieved', { ...user, ...profile });

  } catch (err) {
    next(err);
  }
};


// export const getProfile = async (req, res, next) => {
//     const userId = req.user.user_id;
//     const role = req.user.role;

//     try {
//         const user = await getUserById(req.user.user_id);
//         if (!user) return res.status(404).json({ message: "User not found" });
//         return handleResponse(res, 404, "User");

//         res.status(200).json({
//             user_id: user.user_id,
//             email: user.email,
//             role: user.role,
//             created_at: user.created_at
//         });
//     } catch (err) {
//         next(err);
//     }
// };



// export const getUserProfile = async (req, res, next) => {
//   const userId = req.user.user_id;
//   const role = req.user.role;

//   try {
//     const userQuery = await pool.query(
//         `SELECT user_id, email, role, created_at FROM users WHERE user_id = $1`, [userId]);
//     const user = userQuery.rows[0];

//     if (!user) return res.status(404).json({ message: 'User not found' });

//     let profile = {};

//     if (role === 'tenant') {
//       const tenantQuery = await pool.query(`SELECT * FROM tenants WHERE tenant_id = $1`, [userId]);
//       profile = tenantQuery.rows[0];
//     } else if (role === 'landlord') {
//       const landlordQuery = await pool.query(`SELECT * FROM landlords WHERE landlord_id = $1`, [userId]);
//       profile = landlordQuery.rows[0];
//     }

//     return res.status(200).json({ profile: { ...user, ...profile } });
//   } catch (err) {
//     next(err);
//   }
// };







    
    
    
    

import pool from "../config/db.js";
import bcrypt from 'bcrypt';


//Original Create User


//Create User and Filling Tenant and Landlord tables
export const createUserService = async ({ email, password, role, first_name, last_name, dob, credit_score, annual_income, phone, bio }) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const password_hash = await bcrypt.hash(password, 10);
    const userResult = await client.query(
      `INSERT INTO users (email, password_hash, role)
       VALUES ($1, $2, $3)
       RETURNING user_id, email, role, created_at`,
      [email, password_hash, role]
    );

    const user = userResult.rows[0];

    if (role === 'tenant') {
      await client.query(
        `INSERT INTO tenants (tenant_id, first_name, last_name, dob, credit_score, annual_income)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [user.user_id, first_name, last_name, dob, credit_score, annual_income]
      );
    } else if (role === 'landlord') {
      await client.query(
        `INSERT INTO landlords (landlord_id, first_name, last_name, phone, bio)
         VALUES ($1, $2, $3, $4, $5)`,
        [user.user_id, first_name, last_name, phone, bio]
      );
    }

    await client.query('COMMIT');
    return user;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

//Check for email- login
export const getUserByEmail = async (email) => {
    const result = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    );
    return result.rows[0];
};
import pool from "../config/db.js";

// Get landlord by ID
export const getLandlordById = async (id) => {
  const query = "SELECT * FROM landlords WHERE landlord_id = $1";
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Update landlord profile
export const updateLandlordById = async (id, data) => {
  const { first_name, last_name, phone, profile_photo, bio, verified } = data;
  const query = `
    UPDATE landlords 
    SET first_name = $1, last_name = $2, phone = $3, profile_photo = $4, bio = $5, verified = $6, updated_at = CURRENT_TIMESTAMP 
    WHERE landlord_id = $7 RETURNING *`;
  const result = await pool.query(query, [first_name, last_name, phone, profile_photo, bio, verified, id]);
  return result.rows[0];
};

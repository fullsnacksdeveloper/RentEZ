import pool from '../config/db.js';

//Tenant ID
export const getTenantById = async (tenantId) => {
  const query = 'SELECT * FROM tenants WHERE tenant_id = $1';
  const result = await pool.query(query, [tenantId]);
  return result.rows[0];
};


//Tenant Profile
export const updateTenantProfile = async (tenantId, data) => {
  const { first_name, last_name, dob, credit_score, annual_income } = data;
  const query = `
    UPDATE tenants 
    SET first_name = $1, last_name = $2, dob = $3, credit_score = $4, annual_income = $5, updated_at = CURRENT_TIMESTAMP 
    WHERE tenant_id = $6 RETURNING *`;
  const result = await pool.query(query, [first_name, last_name, dob, credit_score, annual_income, tenantId]);
  return result.rows[0];
};

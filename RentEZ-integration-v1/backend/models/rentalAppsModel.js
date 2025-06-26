const pool = require('../db');

// Create rental application
const createRentalApplicationService = async (applicationData) => {
  const {
    tenant_id,
    property_id,
    employment_status,
    monthly_income,
    additional_info,
  } = applicationData;

  const result = await pool.query(
    `INSERT INTO rental_application
     (tenant_id, property_id, employment_status, monthly_income, additional_info)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [tenant_id, property_id, employment_status, monthly_income, additional_info]
  );

  return result.rows[0];
};

// Get all rental applications
const getAllApplicationsService = async () => {
  const result = await pool.query("SELECT * FROM rental_application");
  return result.rows;
};

// Get one application by ID
const getApplicationByIdService = async (id) => {
  const result = await pool.query(
    "SELECT * FROM rental_application WHERE application_id = $1",
    [id]
  );
  return result.rows[0];
};

// Update application
const updateApplicationService = async (id, updates) => {
  const {
    employment_status,
    monthly_income,
    additional_info
  } = updates;

  const result = await pool.query(
    `UPDATE rental_application
     SET employment_status = $1,
         monthly_income = $2,
         additional_info = $3,
         updated_at = CURRENT_TIMESTAMP
     WHERE application_id = $4
     RETURNING *`,
    [employment_status, monthly_income, additional_info, id]
  );

  return result.rows[0];
};

// Delete application
const deleteApplicationService = async (id) => {
  const result = await pool.query(
    "DELETE FROM rental_application WHERE application_id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

// Update verification status
const updateVerificationStatusService = async (id, status) => {
  const result = await pool.query(
    `UPDATE rental_application
     SET verification_status = $1,
         updated_at = CURRENT_TIMESTAMP
     WHERE application_id = $2
     RETURNING *`,
    [status, id]
  );
  return result.rows[0];
};

module.exports = {
  createRentalApplicationService,
  getAllApplicationsService,
  getApplicationByIdService,
  updateApplicationService,
  deleteApplicationService,
  updateVerificationStatusService
};

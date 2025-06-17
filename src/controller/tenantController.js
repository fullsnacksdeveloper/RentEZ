import pool from '../config/db.js';

// GET Tenant Profile - visible to self, admin, or landlord of applied property
export const getTenantProfile = async (req, res) => {
  const tenantId = parseInt(req.params.id);
  const user = req.user;

  try {
    // Allow admin or owner
    if (user.role === 'admin' || user.user_id === tenantId) {
      const tenant = await TenantModel.getTenantById(tenantId);
      if (!tenant) return handleResponse(res, 404, false, 'Tenant not found');
      return handleResponse(res, 200, true, 'Tenant profile retrieved', tenant);
    }

    // Allow landlord if tenant has applied for their property
    if (user.role === 'landlord') {
      const query = `
        SELECT 1 FROM rental_application ra
        JOIN properties p ON ra.property_id = p.property_id
        WHERE ra.tenant_id = $1 AND p.landlord_id = $2
      `;
      const result = await pool.query(query, [tenantId, user.user_id]);
      if (result.rowCount > 0) {
        const tenant = await TenantModel.getTenantById(tenantId);
        return handleResponse(res, 200, true, 'Tenant profile retrieved', tenant);
      }
    }

    return handleResponse(res, 403, false, 'Access denied');

  } catch (error) {
    errorHandler(res, error);
  }
};

//Update Tenant Profile- only admin and owner
export const updateTenantProfile = async (req, res) => {
  const tenantId = parseInt(req.params.id);
  const user = req.user;

  if (user.role !== 'admin' && user.user_id !== tenantId) {
    return handleResponse(res, 403, false, 'Access denied');
  }

  try {
    const updated2 = await TenantModel.updateTenantProfile(tenantId, req.body);
    return handleResponse(res, 200, true, 'Tenant profile updated', updated2);
  } catch (error) {
    errorHandler(res, error);
  }
};

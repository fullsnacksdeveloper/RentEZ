import { getLandlordById,
        updateLandlordById,
} from '../models/landlordModel.js';

import { handleResponse } from '../utils/handleResponse.js';
import { errorHandling } from '../middleware/errorHandler.js';

export const getLandlordProfile = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const landlord = await LandlordModel.getLandlordById(id);
    if (!landlord) {
      return handleResponse(res, 404, false, 'Landlord not found');
    }
    return handleResponse(res, 200, true, 'Landlord profile retrieved', landlord);
  } catch (err) {
    errorHandling (res, err);
  }
};

export const updateLandlordProfile = async (req, res) => {
  const id = parseInt(req.params.id);
  const user = req.user;

  if (user.role !== 'admin' && user.user_id !== id) {
    return handleResponse(res, 403, false, 'Access denied');
  }

  try {
    const updated = await LandlordModel.updateLandlordById(id, req.body);
    return handleResponse(res, 200, true, 'Landlord profile updated', updated);
  } catch (err) {
    errorHandling(res, err);
  }
};

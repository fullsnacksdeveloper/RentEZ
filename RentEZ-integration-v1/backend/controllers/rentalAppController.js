const pool = require("../db");

const {
  createRentalApplicationService,
  getAllApplicationsService,
  getApplicationByIdService,
  updateApplicationService,
  updateVerificationStatusService,
  deleteApplicationService
} = require("../models/rentalAppsModel");

const { handleResponse } = require("../utils/handleResponse");

// Submit rental application
const submitApplication = async (req, res, next) => {
  try {
    const tenant_id = req.user.user_id;

    if (req.user.role !== "tenant") {
      return handleResponse(res, 403, "Only tenants can apply.");
    }

    const appData = await createRentalApplicationService({
      tenant_id,
      ...req.body
    });

    handleResponse(res, 201, "Application submitted", appData);
  } catch (err) {
    next(err);
  }
};

// Get all rental applications (admin only)
const getAllApplications = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const apps = await getAllApplicationsService();
    handleResponse(res, 200, "Applications retrieved", apps);
  } catch (err) {
    next(err);
  }
};

// Get a specific application by ID
const getApplicationById = async (req, res, next) => {
  try {
    const app = await getApplicationByIdService(req.params.id);

    if (!app) return handleResponse(res, 404, "Application not found.");

    if (
      req.user.role !== "admin" &&
      parseInt(app.tenant_id) !== parseInt(req.user.user_id)
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.status(200).json(app);
  } catch (err) {
    next(err);
  }
};

// Update an application (only if pending & user owns it)
const updateApplication = async (req, res, next) => {
  try {
    const app = await getApplicationByIdService(req.params.id);

    if (!app) return handleResponse(res, 404, "Application not found.");

    if (app.verification_status !== "pending")
      return res.status(403).json({ message: "Cannot edit verified applications" });

    if (parseInt(app.tenant_id) !== parseInt(req.user.user_id))
      return res.status(403).json({ message: "Unauthorized" });

    const updated = await updateApplicationService(req.params.id, req.body);
    res.status(200).json({ message: "Updated", data: updated });
  } catch (err) {
    next(err);
  }
};

// Delete an application (only owner can delete)
const deleteApplication = async (req, res, next) => {
  try {
    const app = await getApplicationByIdService(req.params.id);

    if (!app) return handleResponse(res, 404, "Application not found.");

    if (parseInt(app.tenant_id) !== parseInt(req.user.user_id)) {
      return handleResponse(res, 403, "Unauthorized to delete this application.");
    }

    const deleted = await deleteApplicationService(req.params.id);
    handleResponse(res, 200, "Application deleted", deleted);
  } catch (err) {
    next(err);
  }
};

// Change verification status (admin or landlord only)
const changeVerificationStatus = async (req, res, next) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "landlord") {
      return handleResponse(res, 403, "Only admin and landlords can change status.");
    }

    const updated = await updateVerificationStatusService(
      req.params.id,
      req.body.status
    );
    handleResponse(res, 200, "Verification status updated", updated);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  submitApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  changeVerificationStatus
};

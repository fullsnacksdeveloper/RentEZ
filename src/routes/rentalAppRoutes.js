import express from "express";
import {
  submitApplication,
  fetchAllApplications,
  fetchApplicationById,
  modifyApplication,
  removeApplication,
  changeVerificationStatus
} from "../controllers/rentalApplicationController.js";

import { verify } from "../middleware/verify.js";

const router = express.Router();

// Apply token verification to all below routes
router.use(verify);

router.post("/submit", submitApplication);                 // Tenant
router.get("/getApplications", getAllAllApplications);               // Admin
router.get("/getSingleApplication/:id", getApplicationById);            // Admin or Tenant Owner
router.put("/updateApplication/:id", updateApplication);               // Tenant (if pending)
router.delete("/deleteApplication/:id", deleteApplication);            // Tenant (if pending)
router.patch("/:id/status", changeVerificationStatus); // Admin

export default router;

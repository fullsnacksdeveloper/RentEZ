import express from "express";

import {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  changeVerificationStatus
} from "../controller/rentalAppController.js";

import { verifyToken } from "../middleware/verify.js";
import { authorizeRoles } from "../middleware/authGuard.js";


const router = express.Router();

// Apply token verification to all below routes
router.post("/create", verifyToken, authorizeRoles("tenant"), createApplication);                 // Tenant

router.get("/getApplications", verifyToken, authorizeRoles("admin"), getAllApplications);               // Admin
router.get("/getSingleApplication/:id", verifyToken, authorizeRoles("tenant", "admin"), getApplicationById);            // Admin or Tenant Owner


router.patch("/updateApplication/:id", verifyToken, authorizeRoles ("landlord","admin"), updateApplication);               // Tenant (if pending)
router.patch("/:id/status", verifyToken, authorizeRoles("admin"),changeVerificationStatus); // Admin
router.delete("/deleteApplication/:id", verifyToken, authorizeRoles("admin", "tenant"),deleteApplication);            // Tenant (if pending)


export default router;

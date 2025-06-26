const express = require("express");

const {
  submitApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  changeVerificationStatus
} = require("../controllers/rentalAppController");

const { verifyToken } = require("../middleware/verify");

const router = express.Router();

// Apply token verification to all routes below
router.use(verifyToken);

router.post("/submit", submitApplication);                         // Tenant
router.get("/getApplications", getAllApplications);               // Admin
router.get("/getSingleApplication/:id", getApplicationById);      // Admin or Tenant Owner
router.put("/updateApplication/:id", updateApplication);          // Tenant (if pending)
router.delete("/deleteApplication/:id", deleteApplication);       // Tenant (if pending)
router.patch("/:id/status", changeVerificationStatus);            // Admin

module.exports = router;

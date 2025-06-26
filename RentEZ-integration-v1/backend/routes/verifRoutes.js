const express = require("express");
const {
  updateStatus,
  uploadDocuments,
  verifyAppNotify,
  verifyProperty
} = require("../controllers/verificationController"); // Adjust the path if needed

const router = express.Router();

// Verification
router.patch("/rentals/:id/status", updateStatus); // Admin or landlord

// Background Check
router.post("/verification/manual", uploadDocuments);              // User only
router.get("/verification/notifications", verifyAppNotify);        // User only
router.get("/verification/:id", verifyProperty);                   // Admin or owner

module.exports = router;

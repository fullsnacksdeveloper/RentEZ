import express from "express";

const router= express.Router();


//Verification

router.patch("/rentals/:id/status", updateStatus); //update application status

//Background Check
router.post("/verification/manual", uploadDocuments); //manual submission of user documents for backgroundcheck (user only)
router.get("verification/notifications", verifyAppNotify) //verification notification (user-only) 
router.get("verification/:id", verifyProperty)  //rental verification details (admin or owner)



export default router;

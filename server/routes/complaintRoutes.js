const express = require("express");

const {
    createComplaint,
    getMyComplaints,
    getComplaintById,
    getAllComplaints,
    updateComplaint,
    deleteComplaint
} = require("../controllers/complaintController");

const {
    protect
} = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// CREATE COMPLAINT
// POST /api/complaints
// ==========================================
router.post(
    "/",
    protect,
    createComplaint
);


// ==========================================
// GET MY COMPLAINTS
// GET /api/complaints/my
// ==========================================
router.get(
    "/my",
    protect,
    getMyComplaints
);

router.get(
    "/all",
    protect,
    (req, res, next) => {
        console.log("ADMIN ALL COMPLAINTS ROUTE HIT");
        next();
    },
    getAllComplaints
);

// ==========================================
// GET SINGLE COMPLAINT
// GET /api/complaints/:id
// ==========================================
router.get(
    "/:id",
    protect,
    getComplaintById
);


// ==========================================
// UPDATE COMPLAINT
// PUT /api/complaints/:id
// ==========================================
router.put(
    "/:id",
    protect,
    updateComplaint
);


// ==========================================
// DELETE COMPLAINT
// DELETE /api/complaints/:id
// ==========================================
router.delete(
    "/:id",
    protect,
    deleteComplaint
);


module.exports = router;
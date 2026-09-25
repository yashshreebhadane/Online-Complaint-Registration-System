const Complaint = require("../models/Complaint");

// ==========================================
// CREATE NEW COMPLAINT
// ==========================================
const createComplaint = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            priority,
            location
        } = req.body;

        // Check required fields
        if (
            !title ||
            !description ||
            !category ||
            !location
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required complaint details"
            });
        }

        // Generate unique complaint ID
        const complaintId =
            "CMP-" +
            Date.now() +
            "-" +
            Math.floor(1000 + Math.random() * 9000);

        // Create complaint
        const complaint = await Complaint.create({
            complaintId,
            complainant: req.user.id,
            title,
            description,
            category,
            priority: priority || "Medium",
            location,
            status: "Submitted"
        });

        res.status(201).json({
            success: true,
            message: "Complaint registered successfully",
            complaint
        });

    } catch (error) {
        console.error("Create complaint error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while registering complaint"
        });
    }
};


// ==========================================
// GET ALL COMPLAINTS OF LOGGED-IN USER
// ==========================================
const getMyComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({
            complainant: req.user.id
        })
            .populate("complainant", "name email phone")
            .populate("assignedAgent", "name email department")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: complaints.length,
            complaints
        });

    } catch (error) {
        console.error("Get complaints error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while fetching complaints"
        });
    }
};

// ==========================================
// GET ALL COMPLAINTS - ADMIN
// ==========================================
const getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .populate("complainant", "name email phone")
            .populate("assignedAgent", "name email department")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: complaints.length,
            complaints
        });

    } catch (error) {
        console.error("Get all complaints error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while fetching complaints",
            error: error.message
        });
    }
};


// ==========================================
// GET SINGLE COMPLAINT
// ==========================================
const getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id)
            .populate("complainant", "name email phone")
            .populate("assignedAgent", "name email department");

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        // User can only view their own complaint
        if (
            req.user.role === "user" &&
            complaint.complainant._id.toString() !== req.user.id
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view this complaint"
            });
        }

        res.status(200).json({
            success: true,
            complaint
        });

    } catch (error) {
        console.error("Get complaint error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while fetching complaint"
        });
    }
};


// ==========================================
// UPDATE COMPLAINT
// ==========================================
const updateComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(
            req.params.id
        );

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        // Only complaint owner can update
        if (
            req.user.role === "user" &&
            complaint.complainant.toString() !== req.user.id
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this complaint"
            });
        }

        const {
    title,
    description,
    category,
    priority,
    location,
    status
} = req.body;

        if (title) complaint.title = title;
        if (description) complaint.description = description;
        if (category) complaint.category = category;
        if (priority) complaint.priority = priority;
        if (location) complaint.location = location;
        if (status) complaint.status = status;

        await complaint.save();

        res.status(200).json({
            success: true,
            message: "Complaint updated successfully",
            complaint
        });

    } catch (error) {
        console.error("Update complaint error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while updating complaint"
        });
    }
};


// ==========================================
// DELETE COMPLAINT
// ==========================================
const deleteComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(
            req.params.id
        );

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        // Only owner can delete
        if (
            req.user.role === "user" &&
            complaint.complainant.toString() !== req.user.id
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this complaint"
            });
        }

        await Complaint.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Complaint deleted successfully"
        });

    } catch (error) {
        console.error("Delete complaint error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while deleting complaint"
        });
    }
};


module.exports = {
    createComplaint,
    getMyComplaints,
    getComplaintById,
    getAllComplaints,
    updateComplaint,
    deleteComplaint
};
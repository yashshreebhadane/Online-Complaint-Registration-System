const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
    {
        complaintId: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },

        complainant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        priority: {
            type: String,
            enum: ["Low", "Medium", "High", "Urgent"],
            default: "Medium"
        },

        location: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: [
                "Submitted",
                "Under Review",
                "Assigned",
                "In Progress",
                "Resolved",
                "Rejected",
                "Closed"
            ],
            default: "Submitted"
        },

        assignedAgent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Agent",
            default: null
        },

        evidence: [
            {
                fileName: String,
                filePath: String,
                fileType: String,
                uploadedAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],

        resolution: {
            type: String,
            default: ""
        },

        resolvedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Complaint", complaintSchema);
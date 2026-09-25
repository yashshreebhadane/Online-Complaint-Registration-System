const complaintRoutes = require("./routes/complaintRoutes");
const authRoutes = require("./routes/authRoutes");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");

const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Security middleware
app.use(helmet());

// Enable CORS
app.use(cors());

// Parse JSON requests
app.use(express.json());

// Parse URL-encoded requests
app.use(express.urlencoded({ extended: true }));

// Authentication routes
app.use("/api/auth", authRoutes);

app.use("/api/complaints", complaintRoutes);

// Test API route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Online Complaint Registration API is running"
    });
});

// Server port
const PORT = process.env.PORT || 5000;



// Start server
app.listen(PORT, () => {
    console.log(`SERVER.JS IS RUNNING ON PORT ${PORT}`);
});
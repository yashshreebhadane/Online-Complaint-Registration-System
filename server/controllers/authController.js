const User = require("../models/User");
const Agent = require("../models/Agent");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (id, role) => {
    return jwt.sign(
        {
            id,
            role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
};

// ===============================
// USER REGISTRATION
// ===============================
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check required fields
        if (!name || !email || !password || !phone) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            phone,
            role: "user"
        });

        // Generate token
        const token = generateToken(user._id, user.role);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {
        console.error("User registration error:", error);

        res.status(500).json({
            success: false,
            message: "Server error during registration"
        });
    }
};


// ===============================
// USER LOGIN
// ===============================
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password"
            });
        }

        // Find user
        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check account status
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account is inactive"
            });
        }

        // Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate token
        const token = generateToken(user._id, user.role);

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {
        console.error("User login error:", error);

        res.status(500).json({
            success: false,
            message: "Server error during login"
        });
    }
};


// ===============================
// AGENT REGISTRATION
// ===============================
const registerAgent = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            department,
            specialization
        } = req.body;

        if (
            !name ||
            !email ||
            !password ||
            !phone ||
            !department
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        const existingAgent = await Agent.findOne({
            email: email.toLowerCase()
        });

        if (existingAgent) {
            return res.status(400).json({
                success: false,
                message: "Agent with this email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const agent = await Agent.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            phone,
            department,
            specialization
        });

        const token = generateToken(agent._id, "agent");

        res.status(201).json({
            success: true,
            message: "Agent registered successfully",
            token,
            agent: {
                id: agent._id,
                name: agent.name,
                email: agent.email,
                phone: agent.phone,
                department: agent.department,
                specialization: agent.specialization
            }
        });

    } catch (error) {
        console.error("Agent registration error:", error);

        res.status(500).json({
            success: false,
            message: "Server error during agent registration"
        });
    }
};


// ===============================
// AGENT LOGIN
// ===============================
const loginAgent = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password"
            });
        }

        const agent = await Agent.findOne({
            email: email.toLowerCase()
        });

        if (!agent) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        if (!agent.isActive) {
            return res.status(403).json({
                success: false,
                message: "Agent account is inactive"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            agent.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = generateToken(agent._id, "agent");

        res.status(200).json({
            success: true,
            message: "Agent login successful",
            token,
            agent: {
                id: agent._id,
                name: agent.name,
                email: agent.email,
                phone: agent.phone,
                department: agent.department,
                specialization: agent.specialization
            }
        });

    } catch (error) {
        console.error("Agent login error:", error);

        res.status(500).json({
            success: false,
            message: "Server error during agent login"
        });
    }
};


module.exports = {
    registerUser,
    loginUser,
    registerAgent,
    loginAgent
};
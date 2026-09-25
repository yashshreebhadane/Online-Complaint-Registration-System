const express = require("express");

const {
    registerUser,
    loginUser,
    registerAgent,
    loginAgent
} = require("../controllers/authController");

const router = express.Router();

// User routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Agent routes
router.post("/agent/register", registerAgent);
router.post("/agent/login", loginAgent);

module.exports = router;
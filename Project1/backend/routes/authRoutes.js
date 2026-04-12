//SRP

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/auth")

//Public route so no authentication
router.post("/register", authController.register);
router.post("/login", authController.login);

//Requires authentication
router.get("/me", authMiddleware.protect, authController.getMe);

module.exports = router;
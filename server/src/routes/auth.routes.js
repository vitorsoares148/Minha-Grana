const express = require("express");

const {
  register,
  login,
  logout,
  getUserInfo,
} = require("../controllers/auth.controller");

const { authenticateToken } = require("../middleware/authenticateToken");
const { loginLimiter, registerLimiter } = require("../middleware/rateLimiters");

const router = express.Router();

router.post("/register", registerLimiter, register);

router.post("/login", loginLimiter, login);

router.post("/logout", logout);

router.get("/userinfo", authenticateToken, getUserInfo);

module.exports = router;

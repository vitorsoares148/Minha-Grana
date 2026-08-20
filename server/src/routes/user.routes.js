const express = require("express");

const { updateBalance } = require("../controllers/user.controller");
const { authenticateToken } = require("../middleware/authenticateToken");

const router = express.Router();

router.put("/balance", authenticateToken, updateBalance);

module.exports = router;

const userService = require("../services/user.service");

// ======================================================
// ATUALIZAR BALANÇA
// ======================================================
async function updateBalance(req, res) {
  try {
    const result = await userService.updateBalance(req.userId);

    return res.status(200).json({
      message: "SUCCESS",
      balance: result.availableBalance,
    });
  } catch (error) {
    console.error("Update balance error:", error);

    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
    });
  }
}

module.exports = {
  updateBalance,
};

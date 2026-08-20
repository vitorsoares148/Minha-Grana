// ======================================================
// VALIDAÇÕES
// ======================================================

function isValidMonth(month) {
  return Number.isInteger(month) && month >= 1 && month <= 12;
}

function isValidYear(year) {
  return Number.isInteger(year) && year >= 2000 && year <= 2100;
}

// ======================================================

module.exports = {
  isValidMonth,
  isValidYear,
};

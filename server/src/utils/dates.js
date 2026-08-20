// ======================================================
// FORMATAR DATA
// ======================================================
function formatDate(date) {
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

// ======================================================

module.exports = {
  formatDate,
};

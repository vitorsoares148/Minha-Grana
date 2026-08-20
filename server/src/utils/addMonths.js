const { formatDate } = require("./dates");

// ======================================================
// ADICIONAR MESES
// ======================================================

function addMonths(dateString, months) {
  const [year, month, day] = dateString.split("-").map(Number);

  const date = new Date(Date.UTC(year, month - 1, 1));

  date.setUTCMonth(date.getUTCMonth() + months);

  const lastDayOfMonth = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0),
  ).getUTCDate();

  date.setUTCDate(Math.min(day, lastDayOfMonth));

  return formatDate(date);
}

// ======================================================

module.exports = {
  addMonths,
};

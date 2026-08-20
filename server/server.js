require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./src/routes/auth.routes");
const transactionsRoutes = require("./src/routes/transactions.routes");
const userRoutes = require("./src/routes/user.routes");
const goalsRoutes = require("./src/routes/goals.routes");

const app = express();

const PORT = process.env.PORT || 8080;
const SECRET_KEY = process.env.SECRET_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

if (!SECRET_KEY) {
  throw new Error("SECRET_KEY is not defined in .env");
}

// ======================================================
// CONFIGURAÇÕES
// ======================================================

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/goals", goalsRoutes);

// ======================================================
// SERVER
// ======================================================

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

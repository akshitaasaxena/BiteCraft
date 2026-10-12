const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

connectDB();

app.use(cors({
  origin: process.env.CLIENT_URL || true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const foodRoutes = require("./routes/Foodroutes");

app.use("/api/foods", foodRoutes);
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
  res.json({ message: "Welcome to BiteCraft API" });
});

app.get("/api/health", (req, res) => {
  res.json({ message: "BiteCraft server is running" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});

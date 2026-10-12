const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const app = express();

connectDB();

const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  })
);
app.use(express.json());

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

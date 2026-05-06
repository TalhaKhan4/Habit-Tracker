const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");

const userAuthRoutes = require("./routes/auth.routes.js");
const habitRoutes = require("./routes/habit.routes.js");
const habitLogRoutes = require("./routes/habitLog.routes.js");
const userRoutes = require("./routes/user.routes.js");
const feedbackRoutes = require("./routes/feedback.routes.js");

const connectDB = require("./utils/connectDB.js");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

// routes
app.get("/api", (req, res) => {
  return res
    .status(200)
    .json({ success: true, message: "API is Working!", data: null });
});

app.use("/api/auth", userAuthRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/habit-logs", habitLogRoutes);
app.use("/api/user", userRoutes);
app.use("/api/feedback", feedbackRoutes);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

startServer();

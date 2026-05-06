const express = require("express");
const router = express.Router();

// controller
const {
  setHabitCompletion,
} = require("../controllers/habitLog.controllers.js");

// middleware
const verifyAuthToken = require("../middlewares/verifyAuthToken.middleware.js");
const validateData = require("../middlewares/validateData.middleware.js");

// schema
const { habitLogSchema } = require("../schemas/habitLog.schema.js");

router.post(
  "/set-habit-completion",
  verifyAuthToken,
  validateData(habitLogSchema),
  setHabitCompletion
);

module.exports = router;

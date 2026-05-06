const express = require("express");
const router = express.Router();

// controllers
const { submitFeedback } = require("../controllers/feedback.controllers.js");

// middlewares
const verifyAuthToken = require("../middlewares/verifyAuthToken.middleware.js");

// routes
router.post("/", verifyAuthToken, submitFeedback);

module.exports = router;

const express = require("express");
const router = express.Router();

// controllers
const {
  changePassword,
  deleteAccount,
} = require("../controllers/user.controllers.js");

// middlewares
const verifyAuthToken = require("../middlewares/verifyAuthToken.middleware.js");

// routes
router.put("/change-password", verifyAuthToken, changePassword);
router.delete("/delete-account", verifyAuthToken, deleteAccount);

module.exports = router;

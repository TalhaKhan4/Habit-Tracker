const express = require("express");
const router = express.Router();

// controllers
const {
  signUp,
  verifyEmail,
  logOut,
  logIn,
  checkLogin,
} = require("../controllers/auth.controllers.js");

// middlewares
const validateData = require("../middlewares/validateData.middleware.js");
const verifySignUpToken = require("../middlewares/verifySignUpToken.middleware.js");
const verifyAuthToken = require("../middlewares/verifyAuthToken.middleware.js");

// schemas
const { signUpSchema, logInSchema } = require("../schemas/auth.schemas.js");

// routes
router.post("/signup", validateData(signUpSchema), signUp);
router.post("/verify-email", verifySignUpToken, verifyEmail);
router.post("/login", validateData(logInSchema), logIn);
router.post("/logout", verifyAuthToken, logOut);
router.get("/check-login", checkLogin);

module.exports = router;

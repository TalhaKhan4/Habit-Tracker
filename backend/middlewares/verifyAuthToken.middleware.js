const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");

async function verifyAuthToken(req, res, next) {
  try {
    const authToken = req.cookies?.authToken;
    const verifiedAuthToken = jwt.verify(
      authToken,
      process.env.AUTH_TOKEN_SECRET
    );
    const userId = verifiedAuthToken.id;
    const user = await User.findOne({ _id: userId });
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = verifyAuthToken;

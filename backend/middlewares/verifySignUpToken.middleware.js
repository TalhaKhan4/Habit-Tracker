const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");

async function verifySignUpToken(req, res, next) {
  try {
    const signUpToken = req.cookies?.signUpToken;
    const verifiedSignUpToken = jwt.verify(
      signUpToken,
      process.env.SIGN_UP_TOKEN_SECRET
    );
    const userId = verifiedSignUpToken.id;
    const user = await User.findOne({ _id: userId });
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
  }
}

module.exports = verifySignUpToken;

const User = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const getOtp = require("../utils/getOTP.js");
const sendEmail = require("../utils/sendEmail.js");

async function signUp(req, res) {
  try {
    const { fullName, email, password } = req.validatedData;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Conflict",
        errors: {
          email: "This email is already in use",
        },
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const otp = getOtp();
    console.log(otp);
    const hashedOtp = bcrypt.hashSync(otp, 10);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      otp: hashedOtp,
      otpExpiresIn: new Date(Date.now() + 15 * 60 * 1000), // 15 mins
    });

    const signUpToken = jwt.sign(
      { id: newUser._id },
      process.env.SIGN_UP_TOKEN_SECRET,
      {
        expiresIn: "15m",
      },
    );

    await newUser.save();

    await sendEmail(
      email,
      "Your OTP for Habit Flow Email Verification",
      `Your OTP is ${otp}`,
    );

    return res
      .cookie("signUpToken", signUpToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000, // 15 mins
        sameSite: "strict",
      })
      .status(201)
      .json({
        success: true,
        message: "Account created successfully!",
        data: null,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

async function verifyEmail(req, res, next) {
  try {
    const user = req.user;
    const otp = req.body.otp;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid Input",
        errors: {
          otp: "Otp is required",
        },
      });
    }

    const hashedOtp = user.otp;
    const isOtpValid = bcrypt.compareSync(otp, hashedOtp);

    if (!isOtpValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid Input",
        errors: {
          otp: "Otp is incorrect",
        },
      });
    }

    user.isVerified = true;
    user.otpAttempts = undefined;
    user.otp = undefined;
    user.otpExpiresIn = undefined;
    await user.save();

    const authToken = jwt.sign(
      { id: user._id },
      process.env.AUTH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      },
    );

    return res
      .clearCookie("signUpToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .cookie("authToken", authToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: "strict",
      })
      .status(200)
      .json({
        success: true,
        message: "Email verified successfully",
        data: {
          fullName: user.fullName,
          email: user.email,
          memberSince: user.createdAt,
        },
      });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

function logOut(req, res, next) {
  return res
    .clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    .status(200)
    .json({
      success: true,
      message: "Logged out successfully",
      data: null,
    });
}

async function logIn(req, res, next) {
  try {
    const { email, password } = req.validatedData;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid Input",
        errors: {
          email: "No account found with this email",
        },
      });
    }

    const hashedPassword = existingUser.password;
    const isPasswordValid = bcrypt.compareSync(password, hashedPassword);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid Input",
        errors: {
          password: "password is incorrect",
        },
      });
    }

    const authToken = jwt.sign(
      { id: existingUser._id },
      process.env.AUTH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res
      .cookie("authToken", authToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json({
        success: true,
        message: "Logged in successfully",
        data: {
          fullName: existingUser.fullName,
          email: existingUser.email,
          memberSince: existingUser.createdAt,
        },
      });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

async function checkLogin(req, res, next) {
  try {
    const authToken = req.cookies?.authToken;

    // console.log("authToken =", authToken);

    if (!authToken) {
      return res.status(200).json({
        success: true,
        message: "user is not logged in",
        data: {
          isUserLoggedIn: false,
        },
      });
    }

    const verifiedAuthToken = jwt.verify(
      authToken,
      process.env.AUTH_TOKEN_SECRET,
    );

    const userId = verifiedAuthToken.id;
    const user = await User.findOne({ _id: userId });

    res.status(200).json({
      success: true,
      message: "user is logged in",
      data: {
        isUserLoggedIn: true,
        fullName: user.fullName,
        email: user.email,
        memberSince: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { signUp, verifyEmail, logOut, logIn, checkLogin };

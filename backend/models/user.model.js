const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // users full name asked during signup
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },

    // users email asked during signup
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },

    // password for users account asked during signup
    password: {
      type: String,
      required: [true, "Password is required"],
      validate: {
        validator: function (value) {
          // At least 1 uppercase, 1 lowercase, 1 number, 1 special char, min 8 chars
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(
            value
          );
        },
        message:
          "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.",
      },
    },

    // otp to verify users email (this field is deleted after user verifes their email with correct otp)
    otp: {
      type: String,
    },

    otpAttempts: {
      type: Number,
      default: 0,
    },

    otpExpiresIn: {
      type: Date,
    },

    // showing users email verification status (be default this is false)
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);

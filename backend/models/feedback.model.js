const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["bug", "feature", "general", "other"], // keeps things controlled
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 1000,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  },
);

module.exports = mongoose.model("Feedback", feedbackSchema);

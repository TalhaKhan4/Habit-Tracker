const Feedback = require("../models/feedback.model.js");

const submitFeedback = async (req, res) => {
  const { type, message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ message: "Feedback message is required." });
  }

  try {
    const newFeedback = await Feedback.create({
      type: type || "general", // fallback to avoid enum issues
      message: message.trim(),
      user: req.user.id,
    });

    res.status(201).json({
      message: "Feedback received. Thank you!",
      feedback: newFeedback,
    });
  } catch (err) {
    console.error("submitFeedback error:", err);

    // helpful error for invalid enum values
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }

    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { submitFeedback };

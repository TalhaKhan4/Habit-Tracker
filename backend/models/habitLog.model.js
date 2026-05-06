const mongoose = require("mongoose");

const habitLogSchema = new mongoose.Schema({
  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Habit",
  },

  date: {
    type: String,
    required: true,
    validate: {
      validator: (v) => {
        // Regex to match YYYY-MM-DD format
        return /^\d{4}-\d{2}-\d{2}$/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid date string (expected YYYY-MM-DD)!`,
    },
  },

  isCompleted: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("HabitLog", habitLogSchema);

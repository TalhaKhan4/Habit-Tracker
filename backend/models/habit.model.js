const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
  {
    // habit name
    name: {
      type: String,
      required: [true, "Habit name is required"],
      trim: true,
    },

    // habit description
    description: {
      type: String,
      required: [true, "Habit description is required"],
      trim: true,
    },

    // this field will store the id of the user who has created the habit document
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // user preference of color for this habit
    color: {
      type: String,
      required: true,
      trim: true,
    },

    // for both regular/negative habits and one-time todo user can store their preferred time of day
    // user use this data to sort their habits or one-time todos
    preferredTimeOfDay: {
      type: String,
      enum: ["anytime", "morning", "afternoon", "evening"],
    },

    // this field keeps track of the type of the habit (regular, negative) and one-time todo
    type: {
      type: String,
      enum: ["regular", "negative", "one-time todo"],
      required: true,
    },

    // this field will exist in the document only if the habit type is one-time todo
    isCompleted: {
      type: Boolean,
    },

    // this field will be automatically daysOfWeek for negative habits and for regular habits user has a choice
    scheduleType: {
      type: String,
      enum: ["daysOfWeek", "timesPerWeek"],
    },

    // this field is only present if the habit is regular and scheduleType is timesPerWeek
    timesPerWeek: {
      type: Number,
      min: 1,
      max: 6,
      default: undefined,
    },

    // for negative habits the value will be an array containing values from sunday to saturday and for regular habits with scheduleType set to daysOfWeek the value will be decided by the user
    daysOfWeek: {
      type: [String],
      enum: [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ],
      default: undefined,
    },

    // this field will be present for habits with type of one-time todo only
    // Its value will be set by the users when they are creating the one-time todo
    date: {
      type: String,
      validate: {
        validator: (v) => {
          // Regex to match YYYY-MM-DD format
          return /^\d{4}-\d{2}-\d{2}$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid date string (expected YYYY-MM-DD)!`,
      },
    },

    icon: {
      type: String,
      validate: {
        validator: (v) => {
          const regex = require("emoji-regex")();
          return v.length > 0 && v.replace(regex, "").length === 0;
        },
        message: (props) => `${props.value} must only contain emojis`,
      },
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Habit", habitSchema);

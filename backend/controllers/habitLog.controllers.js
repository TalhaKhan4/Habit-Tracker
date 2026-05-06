const Habit = require("../models/habit.model.js");
const HabitLog = require("../models/habitLog.model.js");

async function setHabitCompletion(req, res, next) {
  try {
    // console.log(req.validatedData);

    const { habitId, date, isCompleted } = req.validatedData;
    const habit = await Habit.findById(habitId);

    // All of the below code is validation, if the request is invalid we are doing early response return

    // if habit is not found
    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found for the send habitId!",
      });
    }

    // if habit type is one-time todo
    if (habit.type === "one-time todo") {
      return res.status(400).json({
        success: false,
        message:
          "This habit type (one-time todo) cannot be toggled using this endpoint",
      });
    }

    // ⚠ Todo :trying to mark a habit complete/incomplete before its createdAt date (for this we need the user time zone)
    // ⚠ Todo trying to mark a habit complete/incomplete in the future (for this we need the user time zone)

    // trying to mark a habit complete/incomplete on a day that is not in the daysOfWeek list (array)
    if (
      habit.type === "regular" &&
      habit.scheduleType === "daysOfWeek" &&
      !habit.daysOfWeek.includes(
        new Date(date)
          .toLocaleDateString("en-US", {
            weekday: "long",
          })
          .toLowerCase(),
      )
    ) {
      return res.status(400).json({
        success: false,
        message: `This habit can be marked complete or incomplete only on : ${habit.daysOfWeek.join(
          ", ",
        )}.`,
      });
    }

    const isHabitLogAlreadyPresent = await HabitLog.findOne({
      habitId: habit._id,
      date: date,
    });

    // trying to mark a habit complete that is already complete
    if (
      (habit.type === "regular" &&
        isCompleted === true &&
        isHabitLogAlreadyPresent) ||
      (habit.type === "negative" &&
        isCompleted === true &&
        !isHabitLogAlreadyPresent)
    ) {
      return res.status(400).json({
        success: false,
        message: "This habit is already marked complete",
      });
    }

    // trying to mark a habit incomplete that is already incomplete
    if (
      (habit.type === "regular" &&
        isCompleted === false &&
        !isHabitLogAlreadyPresent) ||
      (habit.type === "negative" &&
        isCompleted === false &&
        isHabitLogAlreadyPresent)
    ) {
      return res.status(400).json({
        success: false,
        message: "This habit is already marked incomplete",
      });
    }

    // This is where validation ends and the below code is performing the request operations on the db

    if (
      (habit.type === "regular" && isCompleted) ||
      (habit.type === "negative" && !isCompleted)
    ) {
      const newHabitLog = new HabitLog({ habitId, date, isCompleted });
      await newHabitLog.save();

      return res.status(201).json({
        success: "true",
        message: "Habit marked completed successfully!",
        data: {
          habitLog: newHabitLog,
        },
      });
    }

    if (
      (habit.type === "regular" && !isCompleted) ||
      (habit.type === "negative" && isCompleted)
    ) {
      await HabitLog.deleteOne({ habitId, date });

      return res.status(200).json({
        success: "true",
        message: "Habit marked incomplete successfully!",
        data: null,
      });
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = {
  setHabitCompletion,
};

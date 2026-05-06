const Habit = require("../models/habit.model.js");
const HabitLog = require("../models/habitLog.model.js");

async function createHabit(req, res, next) {
  try {
    // console.log(req.validatedData)
    const newHabit = new Habit(req.validatedData);
    newHabit.user = req.user._id;
    await newHabit.save();

    return res.status(201).json({
      success: true,
      message: "Habit created successfully",
      data: {
        newHabit: {
          ...newHabit.toObject(),
          logs: [],
        },
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function getAllHabits(req, res, next) {
  try {
    const userId = req.user._id;

    const habits = await Habit.aggregate([
      {
        $match: {
          user: userId, // only habits belonging to this user
        },
      },
      {
        $lookup: {
          from: "habitlogs",
          let: { habitId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$habitId", "$$habitId"],
                },
              },
            },
          ],
          as: "logs",
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Habits fetched successfully",
      data: {
        habits,
      },
    });
  } catch (error) {
    console.log(error);
  }
}

// work on this
async function deleteHabit(req, res, next) {
  try {
    const habitId = req.params?.id;

    // console.log("habit to be deleted =", habitId);

    // deletedHabit will be null if there was no document found with habitId
    const deletedHabit = await Habit.findByIdAndDelete(habitId);

    if (!deletedHabit) {
      return res
        .status(404)
        .json({ success: false, message: "No habit found with passed id" });
    }

    await HabitLog.deleteMany({ habitId });

    await req.user.save();

    return res.status(200).json({
      success: true,
      message: "Habit deleted successully",
      data: null,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function setOneTimeTodoIsCompletedStatus(req, res, next) {
  try {
    const todo = await Habit.findById(req.validatedData.habitId);

    if (!todo) {
      return res
        .status(404)
        .json({ success: false, message: "No habit found with passed id" });
    }

    if (todo.type !== "one-time todo") {
      return res.status(400).json({
        success: false,
        message: "This route can be used to toggle only one-time todo's",
      });
    }

    if (req.validatedData.isCompleted === todo.isCompleted) {
      return res.status(400).json({
        success: false,
        message: `This todo is already marked ${
          req.validatedData.isCompleted ? "completed" : "uncompleted"
        }`,
      });
    }

    todo.isCompleted = req.validatedData.isCompleted;
    await todo.save();

    return res.status(200).json({
      success: true,
      message: `todo marked ${
        req.validatedData.isCompleted ? "completed" : "uncompleted"
      } successully`,
      data: {
        todo,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

const updateHabit = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const updates = req.body;

    if (updates.type !== undefined) {
      return res
        .status(400)
        .json({ success: false, message: "Habit type cannot be changed" });
    }

    console.log("id = ", id);
    console.log("userId =", userId);

    const habit = await Habit.findOne({ _id: id, user: userId });
    if (!habit) {
      return res
        .status(404)
        .json({ success: false, message: "Habit not found" });
    }

    const COMMON_FIELDS = [
      "name",
      "description",
      "color",
      "icon",
      "preferredTimeOfDay",
    ];

    const ALLOWED_FIELDS_BY_TYPE = {
      regular: [...COMMON_FIELDS, "scheduleType", "timesPerWeek", "daysOfWeek"],
      negative: [...COMMON_FIELDS, "daysOfWeek"],
      "one-time todo": [...COMMON_FIELDS, "isCompleted", "date"],
    };

    const sanitizedUpdates = Object.fromEntries(
      Object.entries(updates).filter(([key]) =>
        ALLOWED_FIELDS_BY_TYPE[habit.type].includes(key),
      ),
    );

    if (habit.type === "regular") {
      if (
        sanitizedUpdates.scheduleType === "timesPerWeek" &&
        sanitizedUpdates.daysOfWeek
      ) {
        return res.status(400).json({
          success: false,
          message: "Cannot set daysOfWeek when scheduleType is timesPerWeek",
        });
      }
      if (
        sanitizedUpdates.scheduleType === "daysOfWeek" &&
        sanitizedUpdates.timesPerWeek
      ) {
        return res.status(400).json({
          success: false,
          message: "Cannot set timesPerWeek when scheduleType is daysOfWeek",
        });
      }
    }

    if (habit.type === "negative") {
      if (sanitizedUpdates.scheduleType || sanitizedUpdates.timesPerWeek) {
        return res.status(400).json({
          success: false,
          message:
            "Negative habits do not support scheduleType or timesPerWeek",
        });
      }
    }

    if (habit.type === "one-time todo") {
      if (
        sanitizedUpdates.scheduleType ||
        sanitizedUpdates.timesPerWeek ||
        sanitizedUpdates.daysOfWeek
      ) {
        return res.status(400).json({
          success: false,
          message: "One-time todos do not support schedule fields",
        });
      }
    }

    const updatedHabit = await Habit.findByIdAndUpdate(
      id,
      { $set: sanitizedUpdates },
      { new: true, runValidators: true },
    );

    return res.status(200).json({
      success: true,
      message: "Habit updated successfully",
      data: updatedHabit,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res
        .status(400)
        .json({ success: false, message: messages.join(", ") });
    }
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid habit ID" });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  createHabit,
  getAllHabits,
  deleteHabit,
  updateHabit,
  setOneTimeTodoIsCompletedStatus,
};

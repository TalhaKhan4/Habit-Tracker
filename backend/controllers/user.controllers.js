const bcrypt = require("bcrypt");
const User = require("../models/user.model.js");
const Habit = require("../models/habit.model.js");
const HabitLog = require("../models/habitLog.model.js");

// ─── PUT /api/profile/change-password ────────────────────────────────────────
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Both fields are required." });
  }
  if (newPassword.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters." });
  }

  try {
    const user = await req.user;
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Current password is incorrect." });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("changePassword error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── DELETE /api/profile/delete-account ──────────────────────────────────────
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }

    // 1. Get all habits of the user
    const userHabits = await Habit.find({ user: userId }).select("_id");

    const habitIds = userHabits.map((habit) => habit._id);

    // 2. Delete all habit logs linked to those habits
    await HabitLog.deleteMany({ habitId: { $in: habitIds } });

    // 3. Delete all habits of the user
    await Habit.deleteMany({ user: userId });

    // 4. Delete user
    await User.findByIdAndDelete(userId);

    // 5. Clear auth cookie
    res.clearCookie("token");

    res.status(200).json({ message: "Account deleted successfully." });
  } catch (err) {
    console.error("deleteAccount error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { changePassword, deleteAccount };

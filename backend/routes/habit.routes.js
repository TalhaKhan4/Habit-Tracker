const express = require("express");
const router = express.Router();

// controllers
const {
  createHabit,
  getAllHabits,
  updateHabit,
  deleteHabit,
  setOneTimeTodoIsCompletedStatus,
} = require("../controllers/habit.controllers.js");

// middlewares
const verifyAuthToken = require("../middlewares/verifyAuthToken.middleware.js");
const validateData = require("../middlewares/validateData.middleware.js");

// schemas
const {
  createHabitSchema,
  setOneTimeTodoIsCompletedStatusSchema,
} = require("../schemas/habit.schema.js");

// routes
router.post("/", verifyAuthToken, validateData(createHabitSchema), createHabit);

router.get("/", verifyAuthToken, getAllHabits);

router.delete("/:id", verifyAuthToken, deleteHabit);

router.patch(
  "/set-one-time-todo-is-completed-status",
  verifyAuthToken,
  validateData(setOneTimeTodoIsCompletedStatusSchema),
  setOneTimeTodoIsCompletedStatus,
);

// this line of code must stay below the above patch

router.patch("/:id", verifyAuthToken, updateHabit);

module.exports = router;

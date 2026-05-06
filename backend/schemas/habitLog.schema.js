const { z } = require("zod");

const habitLogSchema = z.object({
  habitId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid habit ID"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be in YYYY-MM-DD format"),
  isCompleted: z.boolean(),
});

module.exports = { habitLogSchema };

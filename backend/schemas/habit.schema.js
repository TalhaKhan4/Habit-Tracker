const { z } = require("zod");
const emojiRegex = require("emoji-regex")();

const createHabitSchema = z
  .object({
    name: z
      .string({ required_error: "Habit name is required" })
      .trim()
      .min(1, "Habit name cannot be empty"),

    description: z
      .string({ required_error: "Habit description is required" })
      .trim()
      .min(1, "Habit description cannot be empty"),

    user: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "User ID must be a valid MongoDB ObjectId")
      .optional(),

    color: z
      .string({ required_error: "Color is required" })
      .trim()
      .min(1, "Color cannot be empty"),

    preferredTimeOfDay: z
      .enum(["anytime", "morning", "afternoon", "evening"])
      .optional(),

    type: z.enum(["regular", "negative", "one-time todo"], {
      required_error: "Habit type is required",
    }),

    isCompleted: z
      .boolean({
        invalid_type_error: "isCompleted must be true or false",
      })
      .optional(),

    scheduleType: z.enum(["daysOfWeek", "timesPerWeek"]).optional(),

    timesPerWeek: z
      .number({
        invalid_type_error: "timesPerWeek must be a number",
      })
      .min(1, "timesPerWeek must be at least 1")
      .max(6, "timesPerWeek cannot exceed 6")
      .optional(),

    daysOfWeek: z
      .array(
        z.enum([
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
        ])
      )
      .optional(),

    date: z
      .string({
        invalid_type_error: "date must be a string",
      })
      .refine(
        (val) => {
          // Strict YYYY-MM-DD validation: year 0000-9999, month 01-12, day 01-31
          return /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(val);
        },
        { message: "date must be in the format YYYY-MM-DD" }
      )
      .optional(),

    icon: z
      .string({ required_error: "Icon is required" })
      .refine(
        (val) => val.length > 0 && val.replace(emojiRegex, "").length === 0,
        {
          message: "Icon must only contain emojis",
        }
      ),
  })
  .strict()
  .superRefine((data, ctx) => {
    const allDays = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    // 🔹 Rule: scheduleType
    if (data.type === "regular" && !data.scheduleType) {
      ctx.addIssue({
        path: ["scheduleType"],
        code: "custom",
        message: "scheduleType is required for regular habits",
      });
    }

    if (data.type === "negative" && data.scheduleType !== "daysOfWeek") {
      ctx.addIssue({
        path: ["scheduleType"],
        code: "custom",
        message: "scheduleType must be 'daysOfWeek' for negative habits",
      });
    }

    if (data.type === "one-time todo" && data.scheduleType) {
      ctx.addIssue({
        path: ["scheduleType"],
        code: "custom",
        message: "scheduleType must not exist for one-time todos",
      });
    }

    // 🔹 Rule: daysOfWeek
    if (data.type === "regular" && data.scheduleType === "daysOfWeek") {
      if (!data.daysOfWeek || data.daysOfWeek.length === 0) {
        ctx.addIssue({
          path: ["daysOfWeek"],
          code: "custom",
          message:
            "daysOfWeek is required when scheduleType is 'daysOfWeek' for regular habits",
        });
      }
    }

    if (data.type === "negative") {
      if (!data.daysOfWeek || data.daysOfWeek.length !== 7) {
        ctx.addIssue({
          path: ["daysOfWeek"],
          code: "custom",
          message:
            "daysOfWeek is required and must include all 7 days of the week for negative habits",
        });
      } else {
        // ensure it actually contains all 7 days
        for (const day of allDays) {
          if (!data.daysOfWeek.includes(day)) {
            ctx.addIssue({
              path: ["daysOfWeek"],
              code: "custom",
              message:
                "daysOfWeek must include all 7 days of the week for negative habits",
            });
            break;
          }
        }
      }
    }

    if (data.daysOfWeek) {
      const uniqueDays = new Set(data.daysOfWeek);
      if (uniqueDays.size !== data.daysOfWeek.length) {
        ctx.addIssue({
          path: ["daysOfWeek"],
          code: "custom",
          message: "daysOfWeek must not contain duplicate days",
        });
      }
    }

    // 🔹 Rule: daysOfWeek must not exist if scheduleType is timesPerWeek
    if (
      data.scheduleType === "timesPerWeek" &&
      typeof data.daysOfWeek !== "undefined"
    ) {
      ctx.addIssue({
        path: ["daysOfWeek"],
        code: "custom",
        message:
          "daysOfWeek must not be provided when scheduleType is 'timesPerWeek'",
      });
    }

    // 🔹 Rule: date
    if (data.type === "one-time todo") {
      if (!data.date) {
        ctx.addIssue({
          path: ["date"],
          code: "custom",
          message: "date is required for one-time todos",
        });
      }
    } else if (data.date) {
      ctx.addIssue({
        path: ["date"],
        code: "custom",
        message: "date must not be provided for non-one-time habits",
      });
    }

    // 🔹 Rule: one-time todo must not have timesPerWeek or daysOfWeek
    if (data.type === "one-time todo") {
      if (typeof data.timesPerWeek !== "undefined") {
        ctx.addIssue({
          path: ["timesPerWeek"],
          code: "custom",
          message: "timesPerWeek must not be provided for one-time todos",
        });
      }
      if (typeof data.daysOfWeek !== "undefined") {
        ctx.addIssue({
          path: ["daysOfWeek"],
          code: "custom",
          message: "daysOfWeek must not be provided for one-time todos",
        });
      }
    }

    // 🔹 Rule: timesPerWeek
    if (data.scheduleType === "timesPerWeek" && !data.timesPerWeek) {
      ctx.addIssue({
        path: ["timesPerWeek"],
        code: "custom",
        message: "timesPerWeek is required when scheduleType is 'timesPerWeek'",
      });
    }
    if (
      data.scheduleType !== "timesPerWeek" &&
      typeof data.timesPerWeek !== "undefined"
    ) {
      ctx.addIssue({
        path: ["timesPerWeek"],
        code: "custom",
        message:
          "timesPerWeek must not be provided unless scheduleType is 'timesPerWeek'",
      });
    }

    // 🔹 Rule: isCompleted
    if (data.type === "one-time todo") {
      if (typeof data.isCompleted === "undefined") {
        // inject default
        data.isCompleted = false;
      }
    } else {
      if (typeof data.isCompleted !== "undefined") {
        ctx.addIssue({
          path: ["isCompleted"],
          code: "custom",
          message:
            "isCompleted must only exist for one-time todos (and defaults to false)",
        });
      }
    }

    // 🔹 Rule: preferredTimeOfDay
    if (!data.preferredTimeOfDay) {
      ctx.addIssue({
        path: ["preferredTimeOfDay"],
        code: "custom",
        message: "preferredTimeOfDay is required",
      });
    }

    if (data.type === "negative" && data.preferredTimeOfDay !== "anytime") {
      ctx.addIssue({
        path: ["preferredTimeOfDay"],
        code: "custom",
        message: "preferredTimeOfDay must be anytime for negative habits",
      });
    }
  });

const setOneTimeTodoIsCompletedStatusSchema = z.object({
  habitId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid habit ID"),
  isCompleted: z.boolean(),
});

module.exports = {
  createHabitSchema,
  setOneTimeTodoIsCompletedStatusSchema,
};

import { z } from 'zod';

// ISO 8601 date string validation
const dateStringSchema = z.string().refine((val) => !isNaN(Date.parse(val)), {
  message: "Invalid date string. Expected ISO 8601 format.",
});

export const CreateEventSchema = z.object({
  title: z.string().min(1, "Title is required").max(1000, "Title is too long"),
  start: dateStringSchema,
  end: dateStringSchema,
}).refine((data) => new Date(data.start) <= new Date(data.end), {
  message: "End date cannot be before start date",
  path: ["end"],
});

export const QueryEventsSchema = z.object({
  start: dateStringSchema.optional(),
  end: dateStringSchema.optional(),
}).refine(
  (data) => (data.start && data.end) || (!data.start && !data.end),
  {
    message: "Both start and end dates must be provided together, or neither.",
    path: ["end"],
  }
);

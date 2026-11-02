import { EVENT_TYPE, eventTypeKeys } from "@/types/Events";
import { validPostCode } from "@/utils";
import { z } from "zod";

export const baseEventStep1Schema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),
  eventType: z
    .enum(eventTypeKeys, {
      error: `Invalid type, must be ${Object.values(EVENT_TYPE).join(", ")}`,
    })
    .nullable()
    .pipe(
      z.enum(eventTypeKeys, {
        error: `Invalid event type. It must be ${Object.values(EVENT_TYPE).join(", ")}`,
      }),
    ),
  onlineEvent: z.boolean().default(false),
});

const getTodayUTC = (): number => {
  const now = new Date(); // this includes time
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
};

// the form may hold a date or nothing, but it must be a real date to pass
export const eventDateSchema = z
  .object({
    startDate: z
      .date({ error: "Start date invalid" })
      .nullable()
      .pipe(z.date({ error: "Start date is required" })),
    endDate: z
      .date({ error: "End date invalid" })
      .nullable()
      .pipe(z.date({ error: "End date is required" })),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after the start date",
    path: ["endDate"],
  })
  .refine((data) => data.startDate.getTime() >= getTodayUTC(), {
    message: "Start date cannot be in the past",
    path: ["startDate"],
  });

export const onlineEventStep2Schema = eventDateSchema.extend({
  requireRegistration: z.boolean().default(false),
  email: z.email({ error: "Provide a valid email" }),
});

export const physicalEventStep2Schema = eventDateSchema.extend({
  country: z
    .string({ error: "Country is required" })
    .trim()
    .min(1, "Country is required"),
  city: z
    .string({ error: "City is required" })
    .trim()
    .min(2, "City must be at least 2 characters"),
  postCode: z
    .string({ error: "Postcode is required" })
    .trim()
    .min(3, "Postal code must be at least 3 characters")
    .regex(
      validPostCode,
      "Postal code can only contain alphanumeric characters, spaces and hyphens.",
    ),
  address: z
    .string({ error: "Address is required" })
    .trim()
    .min(5, "Address must be at least 5 characters"),
});

export const fullOnlineEventDataSchema = onlineEventStep2Schema.extend({
  ...baseEventStep1Schema.shape,
  onlineEvent: z.literal(true),
});

export const fullPhysicalEventDataSchema = physicalEventStep2Schema.extend({
  ...baseEventStep1Schema.shape,
  onlineEvent: z.literal(false),
});

// individual step types
// z.input here to allow empty starting values
// z.infer expects dates
export type PhysicalEventStepType = z.input<typeof physicalEventStep2Schema>;

export type OnlineEventStepType = z.input<typeof onlineEventStep2Schema>;

export type CreateEventStepType = z.input<typeof baseEventStep1Schema>;

// Full event data shape types
export type PhysicalEventDataType = z.infer<typeof fullPhysicalEventDataSchema>;

export type OnlineEventDataType = z.infer<typeof fullOnlineEventDataSchema>;

export const makePhysicalEventStep2Schema = (countries: string[]) =>
  physicalEventStep2Schema.safeExtend({
    country: z
      .string({ error: "Real country is required" })
      .trim()
      .min(1, "Country is required")
      .refine((value) => countries.includes(value), {
        message: "Please use a valid country",
      }),
  });

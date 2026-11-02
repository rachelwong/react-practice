export const EVENT_TYPE = {
  MEETUP: "meetup",
  WEBINAR: "webinar",
  WORKSHOP: "workshop",
} as const;

// Extract the keys as a tuple type
export type EventType = (typeof EVENT_TYPE)[keyof typeof EVENT_TYPE];

// Create an array of keys at runtime
export const eventTypeKeys = Object.values(EVENT_TYPE) as [
  EventType,
  ...EventType[],
];

export const EVENT_STEP = {
  BASE: "BASE",
  ONLINE: "ONLINE",
  PHYSICAL: "PHYSICAL",
  REVIEW: "REVIEW",
} as const;

export type EventStepType = (typeof EVENT_STEP)[keyof typeof EVENT_STEP];

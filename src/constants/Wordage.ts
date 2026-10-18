export const GAME_ITEMS = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
]; // winning order

export const MAX_TRIES = 3;
export const MAX_HINTS = 2;

export const START_ZONE = "start";
export const DROP_ZONE = "drop";

export const BEFORE_TARGET = "before";
export const AFTER_TARGET = "after";

export const SHOW_ALREADY_CORRECT = "show_correct";
export const SHOW_INCORRECT = "show_incorrect";

export const CORRECT_POS = "correct";
export const INCORRECT_POS = "incorrect";

export const HINT_OPTIONS = [SHOW_ALREADY_CORRECT, SHOW_INCORRECT];

export const BROWSER_SIZE = 3;

export const GAME_STATUS = {
  PLACING: "PLACING", // not all are in drop zone
  PLAYING: "PLAYING", // all are in drop zone
  WON: "WON", // all are in drop zone with outcome
  LOST: "LOST", // all are in drop zone with outcome
} as const;

export type WordageZoneType = typeof START_ZONE | typeof DROP_ZONE;
export type DropTargetPositionType = typeof AFTER_TARGET | typeof BEFORE_TARGET;

export type GameStatusType = (typeof GAME_STATUS)[keyof typeof GAME_STATUS];

export type WordageItem = {
  id: string;
  zone: string;
  status: typeof CORRECT_POS | typeof INCORRECT_POS | null;
};

export type DropTarget = {
  id: string;
  position: DropTargetPositionType;
};

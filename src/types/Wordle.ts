export interface WordleGameType {
  mysteryWord: string;
  attempts: string[]; // max 6
  error?: string | null;
  currentTry: string;
  maxNumberOfAttempts: number;
  maxLengthOfWord: number;
}

export const WordleAction = {
  ADD_ATTEMPT: "ADD_ATTEMPT",
  RESET_ALL: "RESET_ALL",
  SET_MYSTERY_WORD: "SET_MYSTERY_WORD",
  SET_ERROR: "SET_ERROR",
  ADD_CURRENT_CHAR: "ADD_CURRENT_CHAR",
  REMOVE_LAST_CHAR: "REMOVE_LAST_CHAR",
} as const;
// without as const, TypeScript doesn't remember the exact text of each value.
// It only remembers "this is some string".
// So when you write typeof WordleAction.SET_MYSTERY_WORD,
// TypeScript reads it as plain string, not "SET_MYSTERY_WORD".
// without as const, all six actions read as 'type: string' to Typescript
// as const forces Typescript to remember the exact text of each value
// which is how it can differentiate between different actions and whether they have payload

export type WordleGameActionType =
  | { type: typeof WordleAction.SET_MYSTERY_WORD; payload: string }
  | { type: typeof WordleAction.ADD_CURRENT_CHAR; payload: string }
  | { type: typeof WordleAction.REMOVE_LAST_CHAR }
  | { type: typeof WordleAction.ADD_ATTEMPT }
  | { type: typeof WordleAction.RESET_ALL }
  | { type: typeof WordleAction.SET_ERROR; payload: string | null };

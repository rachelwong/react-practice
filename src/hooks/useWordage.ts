import {
  GAME_STATUS,
  HINT_OPTIONS,
  SHOW_ALREADY_CORRECT,
} from "@/constants/Wordage";
import { fullRandomShuffleArray, randomShuffleArray } from "@/utils";
import { useReducer } from "react";

export interface NewWordageState {
  maxSubmitCount: number;
  maxHintCount: number;
  hintsUsed: number;
  submitsUsed: number;
  startItems: NewWordageItem[]; // items in start_zone
  inGameItems: NewWordageItem[]; // in drop_zone
  answer: string[];
  lastSubmitCorrectCount: number | null;
}

// Name actions after what happened, not the event handler
// Actions usually describe the change itself
export type NewWordageActionsType =
  | { type: "GET_HINT" }
  | { type: "SUBMIT_ATTEMPT" }
  | { type: "RESET_GAME" }
  | { type: "REVEAL" }
  | { type: "MOVE_START_ITEM"; payload: { insertAtIndex: number } } // always the first item in startItems
  | {
      type: "MOVE_GAME_ITEM";
      payload: { fromIndex: number; insertAtIndex: number };
    }; // moving within the drop_zone

export type NewWordageItem = {
  value: string;
  confirmedCorrect: boolean; // outcome validated, displayed -> position locked
};

const setupWordageItems = (items: string[]): NewWordageItem[] => {
  // use fullRandomShuffle here to ensure every item is in new position
  // won't accidentally start with a correctly-positioned item
  return fullRandomShuffleArray({ items }).map((x) => {
    return {
      value: x,
      confirmedCorrect: false,
    };
  });
};

const wordageInitialiser = (initial: NewWordageState): NewWordageState => {
  const initialItems = setupWordageItems(initial.answer ?? []);
  return {
    ...initial,
    submitsUsed: 0,
    hintsUsed: 0,
    startItems: initialItems.slice(1),
    inGameItems: initialItems[0] ? [initialItems[0]] : [],
  };
};

const initialState: NewWordageState = {
  maxSubmitCount: 0,
  maxHintCount: 0,
  answer: [],

  submitsUsed: 0,
  hintsUsed: 0,

  inGameItems: [],
  startItems: [],
  lastSubmitCorrectCount: null,
};

function getGameStatus({
  allItemsInGame,
  allSubmitsUsed,
  allConfirmedCorrect,
}: {
  allItemsInGame: boolean;
  allSubmitsUsed: boolean;
  allConfirmedCorrect: boolean;
}) {
  if (!allItemsInGame) {
    return GAME_STATUS.PLACING;
  }
  // don't need ready check as above block early returns
  if (allConfirmedCorrect) {
    return GAME_STATUS.WON;
  }
  if (allSubmitsUsed) {
    return GAME_STATUS.LOST;
  }
  return GAME_STATUS.PLAYING;
}

function wordageReducer(
  state: NewWordageState,
  action: NewWordageActionsType,
): NewWordageState {
  switch (action.type) {
    case "GET_HINT": {
      // do not get hint if
      // // no more hints left
      // // still some start items left
      // // already won
      if (
        state.hintsUsed === state.maxHintCount ||
        state.startItems.length ||
        state.inGameItems.every((x) => x.confirmedCorrect)
      ) {
        return state;
      }

      // eval correct/incorrect items
      // if all current items are already correct, treat as submission event
      if (
        state.inGameItems.every((x, index) => state.answer[index] === x.value)
      ) {
        return {
          ...state,
          hintsUsed: state.hintsUsed + 1,
          inGameItems: state.inGameItems.map((x) => ({
            ...x,
            confirmedCorrect: true,
          })),
        };
      }
      // confirm first correct item OR
      // find first correct but wrong position item and swap to correct position
      const selectedHintAction =
        HINT_OPTIONS[Math.floor(Math.random() * HINT_OPTIONS.length)];

      const currWrongItems = state.inGameItems.filter(
        (x, index) => state.answer[index] !== x.value,
      );

      const currCorrectUnconfirmedItems = state.inGameItems.filter(
        (x, index) => !x.confirmedCorrect && state.answer[index] === x.value,
      );

      // needs incl check whether there unconfirmed correct items
      // or it will fall through to correct first random incorrect item
      if (
        selectedHintAction === SHOW_ALREADY_CORRECT &&
        !!currCorrectUnconfirmedItems.length
      ) {
        const randomCorrectItem = randomShuffleArray({
          items: currCorrectUnconfirmedItems,
        });

        const itemToReveal = randomCorrectItem[0];
        const updatedList = state.inGameItems.map((x) => {
          return x.value === itemToReveal.value
            ? { ...x, confirmedCorrect: true }
            : x;
        });
        return {
          ...state,
          lastSubmitCorrectCount: null,
          hintsUsed:
            state.hintsUsed < state.maxHintCount
              ? state.hintsUsed + 1
              : state.hintsUsed,
          inGameItems: updatedList,
        };
      }

      const randomIncorrectItem = randomShuffleArray({ items: currWrongItems });
      const incorrectItemToReplace = randomIncorrectItem[0];

      const fromIndex = state.inGameItems.findIndex(
        (x) => x.value === incorrectItemToReplace.value,
      );

      if (fromIndex === -1) {
        return state;
      }

      const toIndex = state.answer.findIndex(
        (x) => x === incorrectItemToReplace.value,
      );

      const updatedList = [...state.inGameItems];

      [updatedList[fromIndex], updatedList[toIndex]] = [
        updatedList[toIndex],
        updatedList[fromIndex],
      ];

      return {
        ...state,
        inGameItems: updatedList.map((x) => {
          return x.value === incorrectItemToReplace.value
            ? { ...x, confirmedCorrect: true }
            : x;
        }),
        lastSubmitCorrectCount: null,
        hintsUsed:
          state.hintsUsed < state.maxHintCount
            ? state.hintsUsed + 1
            : state.hintsUsed,
      };
    }
    case "SUBMIT_ATTEMPT": {
      // prevent submitting when
      // // some start items remaining
      // // inGameItems are all confirmed correct
      // // ran out of submit tries
      if (
        state.submitsUsed === state.maxSubmitCount ||
        state.startItems.length ||
        state.inGameItems.every((x) => x.confirmedCorrect)
      ) {
        return state;
      }

      // eval all correct items in inGameItems
      const evalList = state.inGameItems.map((x, index) => {
        if (x.confirmedCorrect) {
          return x;
        }
        if (state.answer[index] === x.value) {
          return {
            ...x,
            confirmedCorrect: true,
          };
        }
        return x;
      });
      return {
        ...state,
        inGameItems: evalList,
        submitsUsed:
          state.submitsUsed < state.maxSubmitCount
            ? state.submitsUsed + 1
            : state.submitsUsed,
        lastSubmitCorrectCount: state.inGameItems.filter(
          (x, index) => state.answer[index] === x.value,
        ).length,
      };
    }
    case "MOVE_START_ITEM": {
      // cannot submit or get hint until no startItems left
      // item to move is always first item in startItems
      if (!state.startItems.length) {
        return state;
      }
      // invalid insertAtIndex values

      const { insertAtIndex } = action.payload;
      if (insertAtIndex < 0 || insertAtIndex > state.inGameItems.length) {
        return state;
      }
      const [firstStartItem, ...restStartItems] = state.startItems;

      const before = state.inGameItems.slice(0, insertAtIndex);
      const after = state.inGameItems.slice(insertAtIndex);

      const updatedList = [...before, firstStartItem, ...after];

      return {
        ...state,
        startItems: restStartItems,
        inGameItems: updatedList,
      };
    }
    case "MOVE_GAME_ITEM": {
      const { fromIndex, insertAtIndex } = action.payload;
      // invalid insertAtIndex values
      // // out of the array
      // // moving to original position
      if (
        fromIndex < 0 ||
        fromIndex > state.inGameItems.length - 1 ||
        insertAtIndex < 0 ||
        insertAtIndex > state.inGameItems.length ||
        fromIndex === insertAtIndex
      ) {
        return state;
      }

      const currentItem = state.inGameItems[fromIndex];

      // don't update position if already correct
      if (currentItem.confirmedCorrect) {
        return state;
      }

      const others = state.inGameItems.filter(
        (_, index) => index !== fromIndex,
      );

      const before = others.slice(0, insertAtIndex);
      const after = others.slice(insertAtIndex);
      // locked items have changed position after currentItem has changed position
      const updatedList = [...before, currentItem, ...after];
      const movableItems = updatedList.filter((x) => !x.confirmedCorrect);

      return {
        ...state,
        // keeps locked (correct) items in their pos while other items get reordered
        // shift() can return undefined, thus ! enforced
        // shift takes first element in array
        inGameItems: state.inGameItems.map((x) =>
          x.confirmedCorrect ? x : movableItems.shift()!,
        ),
        lastSubmitCorrectCount: null,
      };
    }
    case "REVEAL": {
      // no reveal available if already won
      if (
        state.inGameItems.every(
          (x, index) => x.confirmedCorrect || state.answer[index] === x.value,
        )
      ) {
        return state;
      }

      const updatedList = [...state.inGameItems]
        .sort((a, b) => {
          return state.answer.indexOf(a.value) - state.answer.indexOf(b.value);
        })
        .map((x) => ({
          ...x,
          confirmedCorrect: true,
        }));

      return {
        ...state,
        submitsUsed: state.maxSubmitCount,
        hintsUsed: state.maxHintCount,
        inGameItems: updatedList,
        lastSubmitCorrectCount: null,
      };
    }
    case "RESET_GAME": {
      const newInitialState = wordageInitialiser({
        ...initialState,
        // retain original settings from first game
        maxHintCount: state.maxHintCount,
        maxSubmitCount: state.maxSubmitCount,
        answer: state.answer,
      });
      return {
        ...newInitialState,
      };
    }
    default:
      return state;
  }
}

interface UseWordageProps {
  answer: string[];
  maxSubmitCount?: number;
  maxHintCount?: number;
}

const useWordage = ({
  answer,
  maxSubmitCount = 3,
  maxHintCount = 2,
}: UseWordageProps) => {
  const [state, dispatch] = useReducer(
    wordageReducer,
    {
      ...initialState,
      maxSubmitCount,
      answer,
      maxHintCount,
    },
    wordageInitialiser,
  );

  const onGetHint = () => {
    dispatch({ type: "GET_HINT" });
  };

  const reset = () => {
    dispatch({ type: "RESET_GAME" });
  };

  const onSubmit = () => {
    dispatch({ type: "SUBMIT_ATTEMPT" });
  };

  const onMoveStartItem = ({ insertAtIndex }: { insertAtIndex: number }) => {
    dispatch({ type: "MOVE_START_ITEM", payload: { insertAtIndex } });
  };

  const onMoveGameItem = ({
    fromIndex,
    insertAtIndex,
  }: {
    fromIndex: number;
    insertAtIndex: number;
  }) => {
    dispatch({
      type: "MOVE_GAME_ITEM",
      payload: { fromIndex, insertAtIndex },
    });
  };

  const onReveal = () => {
    dispatch({ type: "REVEAL" });
  };

  const gameStatus = getGameStatus({
    allItemsInGame: state.inGameItems.length === state.answer.length,
    allSubmitsUsed: state.submitsUsed === state.maxSubmitCount,
    allConfirmedCorrect:
      // checks whether every item has been confirmed
      state.inGameItems.length > 0 &&
      state.inGameItems.every((x) => x.confirmedCorrect),
  });

  const disableGetHint =
    state.hintsUsed === state.maxHintCount ||
    state.inGameItems.every((x) => x.confirmedCorrect) ||
    gameStatus !== GAME_STATUS.PLAYING;

  const disableSubmit =
    state.submitsUsed === state.maxSubmitCount ||
    gameStatus !== GAME_STATUS.PLAYING;

  const numberWrongItems = state.inGameItems.filter(
    (x, index) => state.answer[index] !== x.value,
  ).length;

  const numberCorrectItems = state.inGameItems.filter(
    (x, index) => state.answer[index] === x.value,
  ).length;

  return {
    state,
    gameStatus,
    disableGetHint,
    disableSubmit,
    numberWrongItems,
    numberCorrectItems,
    onGetHint,
    reset,
    onSubmit,
    onMoveStartItem,
    onMoveGameItem,
    onReveal,
  };
};

export default useWordage;

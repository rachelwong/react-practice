import getRandomWords from "@/services/getRandomWord";
import {
  WordleAction,
  type WordleGameActionType,
  type WordleGameType,
} from "@/types/Wordle";
import { alphabetOnly } from "@/utils";
import { useEffect, useReducer } from "react";

const keyboardRows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"].map((row) =>
  row.split(""),
);

interface UseSimpleWordleProps {
  maxNumberOfAttempts?: number;
  maxLengthOfWord?: number;
}

export const initialWordleState = {
  mysteryWord: "",
  attempts: [],
  currentTry: "",
  maxLengthOfWord: 1,
  maxNumberOfAttempts: 1,
};

function wordleReducer(state: WordleGameType, action: WordleGameActionType) {
  switch (action.type) {
    case WordleAction.ADD_CURRENT_CHAR:
      if (state.currentTry.length >= state.maxLengthOfWord) {
        return state;
      }
      return {
        ...state,
        currentTry: state.currentTry.concat(action.payload),
      };
    case WordleAction.REMOVE_LAST_CHAR:
      if (!state.currentTry.length) {
        return state;
      }
      return {
        ...state,
        currentTry: state.currentTry.slice(0, -1),
      };
    case WordleAction.ADD_ATTEMPT:
      if (
        !state.currentTry.length ||
        state.attempts.length >= state.maxNumberOfAttempts
      ) {
        return state;
      }
      return {
        ...state,
        attempts: [...state.attempts, state.currentTry.toUpperCase()],
        currentTry: "",
      };
    case WordleAction.SET_MYSTERY_WORD:
      return {
        ...state,
        mysteryWord: action.payload,
      };
    case WordleAction.RESET_ALL:
    default:
      return {
        ...initialWordleState,
        // these max values need to be preserved as they are set on first init of hook
        // on load of Wordle game
        maxLengthOfWord: state.maxLengthOfWord,
        maxNumberOfAttempts: state.maxNumberOfAttempts,
      };
  }
}

const useSimpleWordle = ({
  maxNumberOfAttempts = 6,
  maxLengthOfWord = 5,
}: UseSimpleWordleProps) => {
  const [state, dispatch] = useReducer(wordleReducer, {
    ...initialWordleState,
    maxNumberOfAttempts,
    maxLengthOfWord,
  });

  const resetError = () => {
    dispatch({
      type: WordleAction.SET_ERROR,
      payload: null,
    });
  };

  const onSubmit = () => {
    // cannot check for state.currentTry here because
    // useEffect runs once, so the onSubmit copy it calls only knows
    // the first load of state.currentTry which will always be empty string
    // when dispatch is called, reducer has the latest real current state
    // if (!state.currentTry.length) {
    //   return;
    // }
    dispatch({
      type: WordleAction.ADD_ATTEMPT,
    });
  };

  const resetGame = () => {
    dispatch({
      type: WordleAction.RESET_ALL,
    });
  };

  const getMysteryWord = async () => {
    resetError();
    const response = await getRandomWords({
      maxNumber: 1,
      maxLength: state.maxLengthOfWord,
    });

    if (!response || !response?.length) {
      dispatch({ type: WordleAction.SET_ERROR, payload: "Game not available" });
      return;
    }

    dispatch({
      type: WordleAction.SET_MYSTERY_WORD,
      payload: response[0].toUpperCase(),
    });
  };

  const onKeyClick = (key: string) => {
    dispatch({
      type: WordleAction.ADD_CURRENT_CHAR,
      payload: key.toUpperCase(),
    });
  };

  const onRemoveLastChar = () => {
    dispatch({ type: WordleAction.REMOVE_LAST_CHAR });
  };

  // Using a global listener as not using an input for capturing
  // listener only reports that a key was pressed
  // reducer, which always has the current state, decides whether that should do anything
  useEffect(() => {
    function keypressHandler(e: globalThis.KeyboardEvent) {
      if (e.key === "Backspace" || e.key === "Delete") {
        onRemoveLastChar();
      }
      if (alphabetOnly.test(e.key)) {
        onKeyClick(e.key);
      }
      if (e.key === "Enter") {
        onSubmit();
      }
    }

    document.addEventListener("keydown", keypressHandler);

    return () => {
      document.removeEventListener("keydown", keypressHandler);
    };
  }, []);

  return {
    state,
    keyboardRows,
    getMysteryWord,
    onKeyClick,
    onRemoveLastChar,
    onSubmit,
    resetGame,
  };
};

export default useSimpleWordle;

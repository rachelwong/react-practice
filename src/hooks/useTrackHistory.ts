import { useReducer } from "react";
import { v4 as uuidv4 } from "uuid";

// interface Item{id: string, value: string, status: boolean }
// history
// actions
// toggle status
// update text
// delete from list
// add to list

// before every action
// add 'present' to 'past'

// on every undo
// add 'past' to 'present'
// add 'present' to 'future'

export interface Item {
  id: string;
  value: string;
  status: boolean;
  isEdit: boolean;
}

export interface UndoRedoState {
  present: Item[];
  past: Item[][];
  future: Item[][];
}

export const ListAction = {
  ADD_ITEM: "ADD_ITEM",
  DELETE_ITEM: "DELETE_ITEM",
  TOGGLE_STATUS: "TOGGLE_STATUS",
  UPDATE_ITEM_VALUE: "UPDATE_ITEM_VALUE",
  TOGGLE_EDIT_STATUS: "TOGGLE_EDIT_STATUS",
  REDO: "REDO",
  UNDO: "UNDO",
  RESET: "RESET",
} as const;

export type UndoRedoActionsTypes =
  | {
      type: typeof ListAction.ADD_ITEM;
      payload: string; // value
    }
  | {
      type: typeof ListAction.UPDATE_ITEM_VALUE;
      payload: { id: string; value: string };
    }
  | {
      type: typeof ListAction.DELETE_ITEM;
      payload: string; // id
    }
  | {
      type: typeof ListAction.TOGGLE_EDIT_STATUS;
      payload: string; // id
    }
  | {
      type: typeof ListAction.TOGGLE_STATUS;
      payload: string; // id
    }
  | {
      type: typeof ListAction.REDO;
    }
  | {
      type: typeof ListAction.UNDO;
    }
  | {
      type: typeof ListAction.RESET;
    };

function reducer(state: UndoRedoState, action: UndoRedoActionsTypes) {
  switch (action.type) {
    // every additive action
    // move present copy of present into first thing in past
    // change present copy
    // reset all future
    case ListAction.ADD_ITEM: {
      const currentPresentSnapshot = state.present;
      const updatedPast = [currentPresentSnapshot, ...state.past];
      const updatedPresent = [
        ...currentPresentSnapshot,
        { id: uuidv4(), value: action.payload, status: false, isEdit: false },
      ];
      return {
        ...state,
        present: updatedPresent,
        past: updatedPast,
        future: [],
      };
    }
    case ListAction.TOGGLE_EDIT_STATUS: {
      return {
        ...state,
        present: [
          ...state.present.map((presentItem) => {
            if (presentItem.id === action.payload) {
              return {
                ...presentItem,
                isEdit: !presentItem.isEdit,
              };
            }
            return presentItem;
          }),
        ],
      };
    }
    case ListAction.DELETE_ITEM: {
      const currentPresentSnapshot = state.present;
      const updatedPast = [currentPresentSnapshot, ...state.past];
      const updatedPresent = [
        ...state.present.filter((item) => item.id !== action.payload),
      ];
      return {
        ...state,
        present: updatedPresent,
        past: updatedPast,
        future: [],
      };
    }
    case ListAction.UPDATE_ITEM_VALUE: {
      const currentPresentSnapshot = state.present;
      const updatedPast = [currentPresentSnapshot, ...state.past];
      const updatedPresent = [
        ...state.present.map((x) => {
          if (x.id === action.payload.id) {
            return {
              ...x,
              value: action.payload.value,
            };
          }
          return x;
        }),
      ];
      return {
        ...state,
        present: updatedPresent,
        past: updatedPast,
        future: [],
      };
    }
    case ListAction.TOGGLE_STATUS: {
      const currentPresentSnapshot = state.present;
      const updatedPast = [currentPresentSnapshot, ...state.past];
      const updatedPresent = [
        ...state.present.map((presentItem) => {
          if (presentItem.id === action.payload) {
            return {
              ...presentItem,
              status: !presentItem.status,
            };
          }
          return presentItem;
        }),
      ];
      return {
        ...state,
        past: updatedPast,
        present: updatedPresent,
        future: [],
      };
    }
    // move first thing in future stack into present
    // remove first thing in future stack
    // move present into first thing on past stack
    case ListAction.REDO: {
      const currentPresentSnapshot = state.present;
      const updatedPresent = state.future[0];
      const updatedPast = [currentPresentSnapshot, ...state.past];
      const updatedFuture = state.future.slice(1) ?? [];

      return {
        ...state,
        present: updatedPresent,
        future: updatedFuture,
        past: updatedPast,
      };
    }
    // move present into first thing in future stack
    // move past into first thing into present
    // remove first thing in past stack
    case ListAction.UNDO: {
      const currentPresentSnapshot = state.present;
      const updatedFuture = [currentPresentSnapshot, ...state.future];
      const updatedPresent = [...state.past[0]];
      const updatedPast = state.past.slice(1) ?? [];

      return {
        ...state,
        future: updatedFuture,
        present: updatedPresent,
        past: updatedPast,
      };
    }
    case ListAction.RESET:
      return initialState;
    default:
      return state;
  }
}

const initialState: UndoRedoState = {
  present: [
    { id: uuidv4(), value: "Buy groceries", status: false, isEdit: false },
    { id: uuidv4(), value: "Walk the dog", status: true, isEdit: false },
  ],
  past: [], // stacks of snapshots
  future: [], // stacks of snapshots
};

const useTrackHistory = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const undoCount = state.past.length;
  const redoCount = state.future.length;

  const addItem = (val: string) => {
    if (!val.trim().length) {
      return;
    }
    dispatch({ type: ListAction.ADD_ITEM, payload: val });
  };

  const deleteItem = (id: string) => {
    dispatch({ type: ListAction.DELETE_ITEM, payload: id });
  };

  const updateItemValue = (id: string, val: string) => {
    dispatch({
      type: ListAction.UPDATE_ITEM_VALUE,
      payload: {
        id,
        value: val,
      },
    });
  };
  // every other action is
  // add present to past stack FIFO way
  // update present

  // add present to future stack FIFO way
  // update present
  const undo = () => {
    dispatch({ type: ListAction.UNDO });
  };

  // add present to past stack FIFO way
  // update present
  const redo = () => {
    dispatch({ type: ListAction.REDO });
  };

  const toggleStatus = (id: string) => {
    if (!state.present.find((x) => x.id === id)) {
      return;
    }
    dispatch({
      type: ListAction.TOGGLE_STATUS,
      payload: id,
    });
  };

  const toggleEditStatus = (id: string) => {
    if (!state.present.find((x) => x.id === id)) {
      return;
    }
    dispatch({
      type: ListAction.TOGGLE_EDIT_STATUS,
      payload: id,
    });
  };

  return {
    state,
    undoCount,
    redoCount,
    undo,
    redo,
    toggleStatus,
    updateItemValue,
    toggleEditStatus,
    deleteItem,
    addItem,
  };
};

export default useTrackHistory;

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// persisted in local storage
export interface SelectionState {
  selectedNames: string[]; // maximum 2
  maxImagesByBreed: Record<string, number>; // {'beagle': 5 or 10 default}
}

const initialState: SelectionState = {
  selectedNames: [],
  maxImagesByBreed: {},
};

export const selectedBreedSlice = createSlice({
  name: "selectedBreeds",
  initialState,
  reducers: {
    setSelectedBreed: (state, action: PayloadAction<{ name: string }>) => {
      const isAlreadySelected = state.selectedNames.includes(
        action.payload.name.toLowerCase(),
      );
      if (isAlreadySelected) {
        state.selectedNames = state.selectedNames.filter(
          (x) => x !== action.payload.name.toLowerCase(),
        );
      } else if (state.selectedNames.length < 2) {
        state.selectedNames = [
          ...state.selectedNames,
          action.payload.name.toLowerCase(),
        ];
      } else {
        return;
      }
    },
    setImagesByBreed: (state, action) => {},
    resetSelection: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {},
});

export const { setSelectedBreed } = selectedBreedSlice.actions;

export default selectedBreedSlice.reducer;

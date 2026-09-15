import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// persisted in local storage
export interface SelectionState {
  selectedNames: string[]; // maximum 2
  maxImagesByBreed: Record<string, string>; // {'beagle': '5' or '10' default}
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
      const name = action.payload.name.toLowerCase();
      const isAlreadySelected = state.selectedNames.includes(name);

      if (isAlreadySelected) {
        state.selectedNames = state.selectedNames.filter((x) => x !== name);
        // delete state.maxImagesByBreed[name];
      } else if (state.selectedNames.length < 2) {
        state.selectedNames = [...state.selectedNames, name];
      } else {
        return;
      }

      // reset maxImagesByBreed for all breeds whenever a breed is added or removed
      state.maxImagesByBreed = {};
    },
    // this controls what gets saved in the state
    setImageNumberByBreed: (
      state,
      action: PayloadAction<{ name: string; number: string }>,
    ) => {
      const name: string = action.payload.name.toLowerCase();
      const breedValue: number = Number(action.payload.number);

      if (Number.isNaN(breedValue) || breedValue > 10 || breedValue < 0) {
        return;
      }

      const otherBreed = state.selectedNames.find((x) => x !== name);

      const otherBreedNumber = otherBreed
        ? state.maxImagesByBreed[otherBreed]
        : undefined;

      // if there is no other breed, and has no number
      // set current breed with whatever number provided
      if (!otherBreed || !otherBreedNumber) {
        state.maxImagesByBreed[name] = breedValue.toString();
        return;
      }

      // if there is the other breed and the numbers do NOT add to 10
      // do not update state
      if (breedValue + Number(otherBreedNumber) !== 10) {
        return;
      }

      // if there is the other breed and the numbers do add up to 10
      // set current bred with whatever number provided
      state.maxImagesByBreed[name] = breedValue.toString();
    },
    resetSelection: (_) => {
      return initialState;
    },
  },
  // extraReducers: (builder) => {},
});

export const { setSelectedBreed, setImageNumberByBreed } =
  selectedBreedSlice.actions;

export default selectedBreedSlice.reducer;

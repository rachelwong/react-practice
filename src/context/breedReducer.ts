import getDogBreeds from "@/services/getDogBreeds";
import type { DogBreed } from "@/types/DogBreeds";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface BreedState {
  list: DogBreed[];
  searchQuery: string;
  searchNumber: string;
  status: "idle" | "loading" | "error" | "succeed";
}

const initialState: BreedState = {
  list: [],
  searchQuery: "",
  searchNumber: "",
  status: "idle",
};

// Api call to get breeds externally
export const fetchBreeds = createAsyncThunk("list/fetchBreeds", async () => {
  const data = await getDogBreeds();
  // no data
  if (!data || !data?.message || !data?.message) {
    return;
  }

  return Object.entries(data?.message).map(([name, subbreeds]) => {
    return { name, numSubBreeds: subbreeds.length.toString() };
  });
});

export const breedSlice = createSlice({
  name: "breeds",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      return { ...state, searchQuery: action.payload };
    },
    setSearchNumber: (state, action) => {
      return { ...state, searchNumber: action.payload };
    },
    clearSearchQuery: (state) => {
      return { ...state, searchQuery: "", searchNumber: "" };
    },
    resetBreeds: (_) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBreeds.pending, (state, _) => {
        return {
          ...state,
          list: [],
          status: "loading",
        };
      })
      .addCase(fetchBreeds.fulfilled, (state, action) => {
        return {
          ...state,
          status: "succeed",
          list: [...(action.payload ?? [])],
        };
      })
      .addCase(fetchBreeds.rejected, (state) => {
        return {
          ...state,
          list: [],
          status: "error",
        };
      });
  },
});

export const { setSearchQuery, clearSearchQuery, setSearchNumber } =
  breedSlice.actions;

export default breedSlice.reducer;

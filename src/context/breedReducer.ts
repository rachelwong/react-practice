import getDogBreeds from "@/services/getDogBreeds";
import type { DogBreed } from "@/types/DogBreeds";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface BreedState {
  list: DogBreed[];
  status: "idle" | "loading" | "error" | "succeed";
}

const initialState: BreedState = {
  list: [],
  status: "idle",
};

export const fetchBreeds = createAsyncThunk("list/fetchBreeds", async () => {
  const data = await getDogBreeds();
  // no data
  if (!data || !data?.message || !data?.message) {
    return;
  }

  return Object.entries(data?.message).map(([name, subbreeds]) => {
    return { name, numSubBreeds: subbreeds.length };
  });
});

export const breedSlice = createSlice({
  name: "breeds",
  initialState,
  reducers: {
    setError: (state, action) => {
      return { ...state, status: "error" };
    },
    resetBreeds: (state) => {
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

export default breedSlice.reducer;

import getImagesByDogBreed from "@/services/getImagesByDogBreed";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setSelectedBreed } from "./selectBreedReducer";

export interface BreedImageState {
  status: "idle" | "succeeded" | "loading" | "error";
  byBreed: Record<string, string[]>;
}

const initialState: BreedImageState = {
  status: "idle",
  byBreed: {},
};

// always fetches breeds in array
export const fetchBreedImages = createAsyncThunk(
  "byBreed/fetchImages",
  async ({
    breeds,
    numImages = 10,
  }: {
    breeds: string[];
    numImages: number;
  }) => {
    const breedNames = breeds.filter((x) => !!x);

    const data = await Promise.allSettled(
      breedNames.map((breed) => getImagesByDogBreed({ breed, numImages })),
    );

    if (!data) {
      return;
    }

    return breeds.map((item, index) => {
      const result = data[index];
      if (result.status === "fulfilled" && result.value?.message?.length) {
        return {
          breed: item,
          status: "succeeded",
          imageUrls: result.value.message,
        };
      }
      return {
        breed: item,
        status: "error",
        imageUrls: [],
      };
    });
  },
);

export const breedImageSlice = createSlice({
  name: "breedImages",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBreedImages.pending, (state, _) => {
        state.status = "loading";
      })
      .addCase(fetchBreedImages.fulfilled, (state, action) => {
        if (!action.payload) {
          return;
        }
        action.payload.forEach(({ breed, imageUrls }) => {
          state.byBreed[breed] = imageUrls;
        });
        state.status = "succeeded";
      })
      .addCase(fetchBreedImages.rejected, (state, _) => {
        return {
          ...state,
          status: "error",
        };
      })
      .addCase(setSelectedBreed, (state, action) => {
        // this fires whenever setselectedBreed is fired
        const name = action.payload.name.toLowerCase();
        // if breed is in imageSlice, then images have been fetched for it before so it was previously selected
        // getting the same breedName again means it has been de-selected in the selectBreedSlice
        if (state.byBreed[name]) {
          delete state.byBreed[name];
        }
      });
  },
});

export default breedImageSlice.reducer;

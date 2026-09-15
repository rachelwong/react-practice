import { createSelector } from "@reduxjs/toolkit";
import type { DogCeoState } from "./breedStore";

// the state here needs to be the entire store state not from a slice
const allBreeds = (state: DogCeoState) => state.breeds.list;
const breedSearchQuery = (state: DogCeoState) => state.breeds.searchQuery;
const breedSearchNumber = (state: DogCeoState) => state.breeds.searchNumber;

// do not save the filtered list in the state itself. that remains immutable
export const selectFilteredBreedsByName = createSelector(
  [allBreeds, breedSearchQuery, breedSearchNumber],
  (breeds, searchQuery, searchNumber) => {
    if (!searchQuery && !searchNumber) {
      return breeds;
    }
    return breeds.filter((x) => {
      if (
        searchQuery &&
        !x.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      if (searchNumber && x.numSubBreeds?.toString() !== searchNumber) {
        return false;
      }
      return true;
    });
  },
);

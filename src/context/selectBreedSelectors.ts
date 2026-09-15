import { createSelector } from "@reduxjs/toolkit";
import type { DogCeoState } from "./breedStore";

const selectedNames = (state: DogCeoState): string[] =>
  state.selection.selectedNames;
const maxImagesByBreed = (state: DogCeoState) =>
  state.selection.maxImagesByBreed;

// shallow copy of the maxImagesByBreed for display
export const calculatedMaxImageNumByBreed = createSelector(
  [selectedNames, maxImagesByBreed],
  (names, maxImagesByBreed) => {
    // values regsitered
    let registeredBreeds = names.filter(
      (x) => maxImagesByBreed[x] !== undefined,
    );
    // no values registered
    let unregisteredBreeds = names.filter(
      (x) => maxImagesByBreed[x] === undefined,
    );

    let totalRegisteredNumImages = registeredBreeds.reduce((acc, cur) => {
      let value = maxImagesByBreed[cur];

      return acc + Number(value);
    }, 0);

    // calculate share value for each breed
    const newShareValue =
      (10 - totalRegisteredNumImages) / (unregisteredBreeds.length || 1);

    const result: Record<string, string> = {}; // same type oas maxImagesByBreed

    // add existing maxImagesByBreed state into the copy
    registeredBreeds.forEach((x) => (result[x] = maxImagesByBreed[x]));

    // add new calcualted value for breeds that have no values
    unregisteredBreeds.forEach((x) => (result[x] = newShareValue.toString()));

    return result;
  },
);

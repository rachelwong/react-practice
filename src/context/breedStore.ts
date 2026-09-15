import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import breedImagesReducer from "./breedImagesReducer";
import breedReducer from "./breedReducer";
import selectBreedReducer from "./selectBreedReducer";

export const dogCeoStore = configureStore({
  reducer: {
    images: breedImagesReducer,
    breeds: breedReducer,
    selection: selectBreedReducer,
  },
});

export type DogCeoStore = typeof dogCeoStore;
// getsState returns whatever the combined reducer prodcues (i.e. {breeds: BreedState} from breedReducer)
export type DogCeoState = ReturnType<DogCeoStore["getState"]>;
export type DogCeoDispatch = DogCeoStore["dispatch"];

export const useDogCeoSelector = useSelector.withTypes<DogCeoState>();
export const useDogCeoDispatch = useDispatch.withTypes<DogCeoDispatch>();

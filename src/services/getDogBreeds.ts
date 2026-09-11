import axios from "axios";
import type { DogBreedListResponse } from "./types/DogBreedResponse";

const getDogBreeds = async (): Promise<DogBreedListResponse | null> => {
  const baseUrl = `https://dog.ceo/api/breeds/list/all`;
  try {
    const { data } = await axios.get(baseUrl);
    return data;
  } catch (err) {
    console.error(`GetDogBreeds service error, ${err}`);
    throw err;
  }
};

export default getDogBreeds;

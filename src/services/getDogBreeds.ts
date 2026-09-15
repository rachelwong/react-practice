import type { DogBreedListResponse } from "./types/DogBreedResponse";

const getDogBreeds = async (): Promise<DogBreedListResponse | null> => {
  const baseUrl = `https://dog.ceo/api/breeds/list/all`;
  try {
    const res = await fetch(baseUrl);
    // avoid using .then/.catch so that the try/catch throws the error instead
    if (res.status === 200) {
      return await res.json();
    }
    return null;
  } catch (err) {
    console.error(`GetDogBreeds service error, ${err}`);
    throw err;
  }
};

export default getDogBreeds;

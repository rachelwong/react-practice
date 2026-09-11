import axios from "axios";
import type { DogBreedImagesRequest } from "./types/DogBreedImagesRequest";
import type { DogBreedImagesResponse } from "./types/DogBreedImagesResponse";

const getImagesByDogBreed = async ({
  breed,
  numImages = 1,
}: DogBreedImagesRequest): Promise<DogBreedImagesResponse | null> => {
  const resolvedNumImages = numImages || 1; // prevent 0 being used

  const baseUrl = `https://dog.ceo/api/breed/${breed}/images/random/${resolvedNumImages}`;
  try {
    const { data } = await axios.get(baseUrl);
    return data;
  } catch (err) {
    console.error(`GetDogBreedImages service error, ${err}`);
    throw err;
  }
};

export default getImagesByDogBreed;

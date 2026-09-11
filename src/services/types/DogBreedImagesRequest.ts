// https://dog.ceo/api/breed/hound/afghan/images

export type DogBreedImagesRequest = {
  breed: string;
  numImages?: number; // default to 1
};

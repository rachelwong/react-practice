export type DogBreed = {
  name: string;
  numSubBreeds: number;
  maxNumImages: number; // max 10
  images: string[];
};

export type SelectedBreeds = DogBreed[];

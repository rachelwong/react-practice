export type DogBreed = {
  name: string;
  numSubBreeds?: number | string;
  maxNumImages?: number; // max 10
  images?: string[];
};

export type SelectedBreeds = DogBreed[];

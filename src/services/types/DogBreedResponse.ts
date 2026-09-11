// https://dog.ceo/api/breeds/list/all

export type DogBreedListData = Record<string, string[]>; // {'african': [;wild'], 'airedale': []}

export type DogBreedListResponse = {
  message: DogBreedListData;
  status: string;
};

import type { DogBreed } from "@/types/DogBreeds";
import { useState } from "react";

const useDogList = () => {
  const [selectedBreeds, setSelectedBreeds] = useState<DogBreed[]>([]);

  return {
    selectedBreeds,
  };
};

export default useDogList;

import type { DogBreed } from "@/types/DogBreeds";
import { Card, CardContent, CardHeader } from "./ui/card";

interface DogBreedImageCardProps {
  breed: DogBreed;
}

const DogBreedImageCard = ({ breed }: DogBreedImageCardProps) => {
  return (
    <Card className="flex flex-col w-full bg-neutral-300 border-neutral-900">
      <CardHeader className="flex flex-col w-full">
        <h2 className="text-lg font-extrabold capitalize">{breed.name}</h2>
        <p>Number of sub breeds {JSON.stringify(breed.numSubBreeds)}</p>
        <p>Number of images to display {JSON.stringify(breed)}</p>
      </CardHeader>
      <CardContent className="grid grid-gap-3 grid-auto-flow"></CardContent>
    </Card>
  );
};

export default DogBreedImageCard;

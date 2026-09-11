import type { DogBreed } from "@/types/DogBreeds";
import { EyeOff } from "lucide-react";
import { Button } from "./ui/button";

interface DogBreedImageProps {
  url: string;
  breed: DogBreed;
  index: number;
  hideImage: () => void;
}

const DogBreedImage = ({
  url,
  breed,
  index,
  hideImage,
}: DogBreedImageProps) => {
  return (
    <div className="shadow-sm w-30 flex flex-col">
      <img
        key={url}
        className="w-30 h-30 object-cover"
        src={url}
        alt={`${breed.name}-image-${index}`}
      />
      <Button
        variant="outline"
        onClick={() => {
          hideImage();
        }}
        className="mt-3"
      >
        <EyeOff />
      </Button>
    </div>
  );
};

export default DogBreedImage;

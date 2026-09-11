import getImagesByDogBreed from "@/services/getImagesByDogBreed";
import type { DogBreed } from "@/types/DogBreeds";
import { useEffect, useState } from "react";
import DogBreedImage from "./DogBreedImage";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

interface DogBreedImageCardProps {
  breed: DogBreed;
}

const DogBreedImageCard = ({ breed }: DogBreedImageCardProps) => {
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const getImages = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await getImagesByDogBreed({
        breed: breed.name,
        numImages: breed?.maxNumImages,
      });

      if (
        response?.status.toLowerCase() !== "success" ||
        !response?.message?.length
      ) {
        setError(true);
        return;
      }
      setImageUrls(response?.message);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleHideBreedImage = (url: string) => {
    setImageUrls((prev) => prev.filter((item) => item !== url));
  };

  useEffect(() => {
    getImages();
  }, [breed?.maxNumImages]);

  return (
    <Card className="flex flex-col w-full bg-sky-100 border-neutral-900">
      <CardHeader className="flex flex-col w-full">
        <h2 className="text-lg font-extrabold capitalize">{breed.name}</h2>
        <p>Number of sub breeds {JSON.stringify(breed.numSubBreeds)}</p>
        <p>Number of images to display {JSON.stringify(breed)}</p>
      </CardHeader>
      {loading && !error && (
        <div className="flex flex-col gap-y-4">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      )}
      {error && (
        <Alert className="w-full border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-50 my-3">
          <AlertTitle>Please try again later</AlertTitle>
          <AlertDescription>
            There has been an error with getting Dog images.
          </AlertDescription>
        </Alert>
      )}
      {!error && !loading && !!imageUrls.length && (
        <CardContent className="grid grid-gap-3 grid-auto-flow">
          <p>imageUrls {JSON.stringify(imageUrls)}</p>
          {imageUrls.map((url, index) => {
            return (
              <DogBreedImage
                key={url}
                url={url}
                breed={breed}
                index={index}
                hideImage={() => handleHideBreedImage(url)}
              />
            );
          })}
          {!error && !loading && !imageUrls.length && (
            <Alert className="w-full border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50 my-3">
              <AlertTitle>No more images to display</AlertTitle>
              <AlertDescription>
                Try re-selecting images to show in the list on the left.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default DogBreedImageCard;

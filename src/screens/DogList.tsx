import DogBreedImageCard from "@/components/DogBreedImageCard";
import DogBreedListCard from "@/components/DogBreedListCard";
import Layout from "@/components/Layout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import getDogBreeds from "@/services/getDogBreeds";
import type { DogBreed } from "@/types/DogBreeds";
import { useEffect, useState } from "react";

const MAX_NUM_SELECTION = 2;

const DogList = () => {
  const [allBreeds, setAllBreeds] = useState<DogBreed[]>([]);
  const [selectedBreeds, setSelectedBreeds] = useState<DogBreed[]>([]);

  const [loadingAllBreeds, setLoadingAllBreeds] = useState<boolean>(false);
  const [errorAllBreeds, setErrorAllBreeds] = useState<boolean>(false);
  const getBreeds = async () => {
    try {
      setErrorAllBreeds(false);
      setLoadingAllBreeds(true);
      const response = await getDogBreeds();
      if (response?.status.toLowerCase() === "success") {
        const parsed = Object.entries(response?.message).map((arrItem) => {
          return {
            name: arrItem[0],
            numSubBreeds: arrItem[1].length === 1 ? 0 : arrItem[1].length,
          };
        });
        setAllBreeds(parsed);
      }
    } catch (err) {
      setErrorAllBreeds(true);
    } finally {
      setLoadingAllBreeds(false);
    }
  };

  const handleSelectBreed = ({
    checked,
    breedName,
  }: {
    checked: boolean;
    breedName: string;
  }): void => {
    if (checked && selectedBreeds.length < MAX_NUM_SELECTION) {
      const selected = allBreeds.find((x) => x.name === breedName) as DogBreed; // TODO need a check?
      setSelectedBreeds([...selectedBreeds, selected]);
    } else {
      const filteredList = selectedBreeds.filter((x) => x.name !== breedName);
      setSelectedBreeds([...filteredList]);
    }
  };

  const handleBreedImageNum = ({
    breedName,
    imageNum,
  }: {
    breedName: string;
    imageNum: number;
  }): void => {
    console.log("handleBreedImageNum", breedName, imageNum);
    setSelectedBreeds((prev) =>
      prev.map((item) => {
        if (breedName === item.name) {
          return {
            ...item,
            maxNumImages: imageNum,
          };
        }
        return item;
      }),
    );
  };

  useEffect(() => {
    if (selectedBreeds?.length) {
      setSelectedBreeds((prev) =>
        prev.map((breed) => {
          return {
            ...breed,
            maxNumImages: selectedBreeds.length === MAX_NUM_SELECTION ? 5 : 10,
          };
        }),
      );
    }
  }, [selectedBreeds?.map((x) => x.name)]);

  useEffect(() => {
    // Double firing in DEV due to StrictMode
    getBreeds();
  }, []);

  return (
    <Layout
      heading={
        <>
          <h3>Dog CEO List</h3>
          <ul className="list-disc">
            <li>
              Use{" "}
              <a href="https://dog.ceo/dog-api/documentation/">
                https://dog.ceo/dog-api/documentation/
              </a>{" "}
              API
            </li>
            <li>
              List all breeds with a checkbox (displaying the number of
              sub-breeds under every top-level breed). Max 2 breeds can be
              selected.
            </li>
            <li>
              Show 10 images from the selected breed, if two breeds are selected
              show 10 images in total, 5 from each breed.
            </li>
            <li>
              Ability to remove images, once all images of a breed are removed
              that breed should be unselected in the list.
            </li>
            <li>
              Write a service to communicate to the external API — components
              call the service to get data.
            </li>
            <li>
              User should be able to change the max number of images to be
              visible for the selected breed.
            </li>
            <li>
              If the browser is closed and reloaded, the app should remember
              user preference.
            </li>
            <li>Breed list and breed images should be separate components.</li>
          </ul>
        </>
      }
    >
      <div className="dog-list w-full flex flex-wrap flex-row justify-between align-start mb-6">
        <div className="breed-list w-1/2 flex flex-col pr-4 gap-y-6">
          <h2 className="font-bold text-lg">List of breeds</h2>
          {loadingAllBreeds && (
            <Card className="w-full max-w-xs flex flex-col">
              <CardHeader className="flex flex-col">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="aspect-video w-full" />
              </CardContent>
            </Card>
          )}
          {!loadingAllBreeds && errorAllBreeds && (
            <Alert className="w-full border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-50 my-3">
              <AlertTitle>Please try again later</AlertTitle>
              <AlertDescription>
                There has been an error with getting Dog CEOs.
              </AlertDescription>
            </Alert>
          )}
          {!loadingAllBreeds &&
            !errorAllBreeds &&
            allBreeds.map((breed) => (
              <DogBreedListCard
                key={breed.name}
                breed={breed}
                isSelected={!!selectedBreeds.find((x) => x.name === breed.name)}
                isDisabled={
                  selectedBreeds.length === MAX_NUM_SELECTION &&
                  !selectedBreeds.find((x) => x.name === breed.name)
                }
                handleSelect={handleSelectBreed}
                updateImageNumber={handleBreedImageNum}
              />
            ))}
        </div>
        <div className="selected-dog-images w-1/2 pl-4 flex flex-col">
          <h2 className="font-bold text-lg">Selected breeds</h2>
          <div className="mt-6 flex flex-col gap-y-6">
            {!selectedBreeds?.length && (
              <Alert className="w-full border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50 my-3">
                <AlertDescription>No breeds selected</AlertDescription>
              </Alert>
            )}
            {selectedBreeds?.length > 0 &&
              selectedBreeds?.map((breed) => (
                <DogBreedImageCard key={breed.name} breed={breed} />
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DogList;

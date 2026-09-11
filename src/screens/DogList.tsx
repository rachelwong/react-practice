import Layout from "@/components/Layout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import getDogBreeds from "@/services/getDogBreeds";
import type { DogBreed } from "@/types/DogBreeds";
import { useEffect, useState } from "react";

const DogList = () => {
  const [allBreeds, setAllBreeds] = useState<
    { name: string; numSubBreeds: number }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [selectedBreeds, setSelectedBreeds] = useState<DogBreed[]>();

  const getBreeds = async () => {
    try {
      setError(false);
      setLoading(true);
      const response = await getDogBreeds();
      if (response?.status === "success") {
        const parsed = Object.entries(response?.message).map((arrItem) => {
          return {
            name: arrItem[0],
            numSubBreeds: arrItem[1].length === 1 ? 0 : arrItem[1].length,
          };
        });
        setAllBreeds(parsed);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

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
      <div className="dog-list w-full flex flex-wrap flex-row justify-between align-start">
        <div className="breed-list w-1/2 flex flex-col pr-4 gap-y-6">
          <h2 className="font-bold text-lg">List of breeds</h2>
          {allBreeds.map((breed) => (
            <Card key={breed.name}>
              <CardHeader className="capitalize flex flex-wrap align-center justify-start">
                <Field orientation="horizontal">
                  <Checkbox
                    id={`${breed.name}-checkbox`}
                    name={`${breed.name}-checkbox`}
                  />
                  <Label htmlFor={`${breed.name}-checkbox`}>
                    <span>Select</span>
                    <span className="font-extrabold">{breed.name}</span>
                  </Label>
                </Field>
              </CardHeader>
              <CardContent className="capitalize flex flex-wrap align-center justify-start">
                Number of sub-breeds:{"  "}
                <span className="font-extrabold">{breed.numSubBreeds}</span>
              </CardContent>
              <CardFooter className="bg-neutral-100">
                <CardAction className="flex flex-col w-full">
                  <Field>
                    <FieldLabel>Number of images to display </FieldLabel>
                  </Field>
                  <Input
                    className="w-full mt-3"
                    max="10"
                    type="number"
                    min="1"
                    placeholder="Number of images"
                  />
                </CardAction>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="selected-dog-images w-1/2 pl-4 flex flex-col">
          <h2 className="font-bold text-lg">Selected breeds</h2>
          <div className="mt-6 flex flex-col">
            {!selectedBreeds?.length && (
              <Alert className="w-full border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50 my-3">
                <AlertDescription>No breeds selected</AlertDescription>
              </Alert>
            )}
            {selectedBreeds?.length && <Card className=""></Card>}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DogList;

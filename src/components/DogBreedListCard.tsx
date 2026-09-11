import type { DogBreed } from "@/types/DogBreeds";
import classNames from "classnames";
import { useState, type ChangeEvent } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Field, FieldContent, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface DogBreedCardProps {
  breed: DogBreed;
  isSelected: boolean;
  isDisabled: boolean;
  handleSelect: ({
    checked,
    breedName,
  }: {
    checked: boolean;
    breedName: string;
  }) => void;
  updateImageNumber: ({
    breedName,
    imageNum,
  }: {
    breedName: string;
    imageNum: number;
  }) => void;
}

const DogBreedListCard = ({
  breed,
  isSelected,
  isDisabled,
  handleSelect,
  updateImageNumber,
}: DogBreedCardProps) => {
  const [imageNum, setImageNum] = useState<number>(1);
  const [imageNumError, setImageNumError] = useState<boolean>(false);
  const handleImageNum = (
    e: ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    setImageNumError(false);
    if (!isNaN(Number(e.target.value)) && Number(e.target.value) > 0) {
      setImageNum(Number(e.target.value));
    } else {
      setImageNumError(true);
    }
  };
  return (
    <Card
      key={breed.name}
      aria-disabled={!!isDisabled || undefined}
      className={classNames("breed-card ", {
        "border-neutral-300 text-neutral-700": !!isDisabled && !isSelected,
        "bg-green-300 text-green-900": !isDisabled && isSelected,
      })}
    >
      <CardHeader className="capitalize flex flex-wrap align-center justify-start">
        <Field orientation="horizontal">
          <Checkbox
            className="h-6 w-6"
            id={`${breed.name}-checkbox`}
            name={`${breed.name}-checkbox`}
            disabled={isDisabled && !isSelected}
            checked={isSelected}
            onCheckedChange={(checked) => {
              handleSelect({ checked, breedName: breed.name });
            }}
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
      <CardFooter
        className={classNames({
          "bg-neutral-100": !isDisabled && !isSelected,
          "border-neutral-300 bg-neutral-300 text-neutral-700":
            !!isDisabled && !isSelected,
          "bg-green-100 text-green-900": !isDisabled && isSelected,
        })}
      >
        <CardAction className="flex flex-col w-full">
          <Field>
            <FieldLabel>Specify number of images to display</FieldLabel>
          </Field>
          <FieldContent className="w-full flex justify-between flex-row gap-x-6 align-center mt-4">
            <Input
              className="w-full "
              max="10"
              type="number"
              min="1"
              disabled={!!isDisabled && !isSelected}
              placeholder="Number of images"
              aria-disabled={(!!isDisabled && !isSelected) || undefined}
              onChange={(e) => handleImageNum(e)}
            />
            <Button
              variant="default"
              disabled={!!isDisabled && !isSelected}
              onClick={() =>
                updateImageNumber({
                  breedName: breed.name,
                  imageNum,
                })
              }
            >
              Confirm
            </Button>
          </FieldContent>
          {!!imageNumError && (
            <p className="text-sm text-red-900 mt-2">
              Number must be 1 or larger with no decimals.
            </p>
          )}
        </CardAction>
      </CardFooter>
    </Card>
  );
};

export default DogBreedListCard;

import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  clearSearchQuery,
  fetchBreeds,
  setSearchNumber,
  setSearchQuery,
} from "@/context/breedReducer";
import { selectFilteredBreedsByName } from "@/context/breedSelectors";
import { useDogCeoDispatch, useDogCeoSelector } from "@/context/breedStore";
import { setSelectedBreed } from "@/context/selectBreedReducer";
import { useEffect, type ChangeEvent } from "react";

const ReduxDogList = () => {
  const { status, searchQuery, searchNumber } = useDogCeoSelector(
    (state) => state.breeds,
  );

  const { selectedNames } = useDogCeoSelector((state) => state.selection);

  const dispatch = useDogCeoDispatch();

  // don't use the useSelector here as we're picking up the state from the store
  const filteredBreeds = useDogCeoSelector(selectFilteredBreedsByName);

  useEffect(() => {
    dispatch(fetchBreeds());
  }, [dispatch]);

  if (status === "error") {
    return "Error getting breeds";
  }

  if (status === "loading") {
    return "Loading breeds ";
  }

  const searchBreedsByName = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  // select can return a null value
  const searchBreedsBySubBreedNumber = (value: string | null) => {
    dispatch(setSearchNumber(value ?? ""));
  };

  const breedNumbers = Array.from(Array(5).keys()).map((x) => {
    return {
      label: x.toString(),
      value: x.toString(),
    };
  });

  const onHandleCheckboxChange = ({ name }: { name: string }) => {
    dispatch(setSelectedBreed({ name }));
  };

  return (
    <div className="block absolute w-full h-dvh border-3 border-slate-900">
      <Layout>
        <div className="block relative w-full flex flex-row justify-between align-stretch h-900 ">
          <div className="relative block redux-dog-list h-full overflow-y-auto w-1/2 border-1 border-slate-900 p-6">
            <h3 className="text-2xl font-extrabold mb-6">Dog breed list</h3>
            <div className="bg-neutral-100 p-4 flex flex-row gap-x-3 align-center justify-start mb-4">
              <Input
                placeholder="Search by"
                value={searchQuery}
                onChange={searchBreedsByName}
              />
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  dispatch(clearSearchQuery());
                }}
              >
                Reset
              </Button>
            </div>
            <div className="bg-neutral-100 p-4 flex flex-row gap-x-3 align-center justify-start mb-4">
              <Select
                onValueChange={searchBreedsBySubBreedNumber}
                value={searchNumber}
                items={breedNumbers}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by number of sub-breeds" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Number of Sub-breeds</SelectLabel>
                    {breedNumbers.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {!filteredBreeds?.length && <p>No breeds available</p>}
            {filteredBreeds?.length && (
              <ol className="list-decimal flex flex-col gap-y-3">
                {filteredBreeds.map((x) => (
                  <li
                    key={x.name}
                    className="flex flex-row justify-start align-center gap-x-4"
                  >
                    <Checkbox
                      className="w-10 h-10"
                      checked={selectedNames.includes(x.name.toLowerCase())}
                      onCheckedChange={(_) => {
                        onHandleCheckboxChange({
                          name: x.name,
                        });
                      }}
                    />
                    <p>Name: {x.name}</p>
                    <p>Number of sub breeds: {x.numSubBreeds}</p>
                  </li>
                ))}
              </ol>
            )}
          </div>
          <div className="relative block redux-dog-list h-full overflow-y-auto w-1/2 bg-neutral-100 p-6">
            <h3 className="text-2xl font-extrabold mb-6">
              Selected breeds & images
            </h3>
            {!selectedNames.length && (
              <p className="text-neutral-600">No breeds selected</p>
            )}
            <ul className="list-disc">
              {selectedNames.map((x) => {
                return <li>{x}</li>;
              })}
            </ul>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default ReduxDogList;

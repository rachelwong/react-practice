import { fetchBreedImages } from "@/context/breedImagesReducer";
import { useDogCeoDispatch, useDogCeoSelector } from "@/context/breedStore";
import { calculatedMaxImageNumByBreed } from "@/context/selectBreedSelectors";
import { useEffect } from "react";

const ReduxDogImages = () => {
  const { selectedNames, maxImagesByBreed } = useDogCeoSelector(
    (state) => state.selection,
  );
  const { byBreed, status: imagesStatus } = useDogCeoSelector(
    (state) => state.images,
  );

  const imageNumByBreed = useDogCeoSelector(calculatedMaxImageNumByBreed);

  const dispatch = useDogCeoDispatch();

  useEffect(() => {
    // get breeds do not yet exist on the images slice
    const breedsNeeded = selectedNames.filter((name) => !byBreed[name]);

    if (!breedsNeeded.length) {
      return;
    }
    // always 10 as that's the max
    dispatch(fetchBreedImages({ breeds: breedsNeeded, numImages: 10 }));
  }, [dispatch, byBreed, selectedNames]);

  return (
    <div className="redux-dog-images relative my-3 flex flex-col align-start justify-start">
      <h3 className="text-2xl font-extrabold">Dog images</h3>
      {selectedNames.map((breed) => {
        return (
          <div key={breed} className="bg-amber-100 p-4 flex flex-col">
            <h4 className="text-1xl font-extrabold capitalize">{breed}</h4>
            <ul className="flex flex-row flex-wrap gap-10 w-full">
              {imagesStatus === "succeeded" &&
                !!byBreed[breed] &&
                !!byBreed[breed].length &&
                byBreed[breed]
                  .slice(
                    0,
                    Number(maxImagesByBreed[breed]) ||
                      Number(imageNumByBreed[breed]),
                  )
                  .map((imageUrl, index) => (
                    <li
                      className="relative w-30 h-30 flex flex-col align-start justify-start"
                      key={imageUrl}
                    >
                      <div className="relative block w-30 h-30 border-1 border-red-900">
                        <img
                          src={imageUrl}
                          alt={`${breed}-image-${index}`}
                          className="object-cover block relative w-full h-full"
                        />
                      </div>
                      <p className="text-sm">
                        #{index + 1} - {breed}
                      </p>
                    </li>
                  ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default ReduxDogImages;

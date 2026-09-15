import { fetchBreeds } from "@/context/breedReducer";
import { useDogCeoDispatch, useDogCeoSelector } from "@/context/breedStore";
import { useEffect } from "react";

const ReduxDogList = () => {
  const { list, status } = useDogCeoSelector((state) => state.breeds);
  const dispatch = useDogCeoDispatch();

  useEffect(() => {
    dispatch(fetchBreeds());
  }, [dispatch]);

  if (status === "error") {
    return "Error getting breeds";
  }

  if (status === "loading") {
    return "Loading breeds ";
  }

  return (
    <div className="redux-dog-list">
      <h3>Dog breed list</h3>

      <ol className="list-decimal">
        {list.map((x) => (
          <li key={x.name}>
            <p>
              Name: {x.name} NumSubBreeds: {x.numSubBreeds}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ReduxDogList;

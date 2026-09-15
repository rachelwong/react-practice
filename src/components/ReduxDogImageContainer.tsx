import classNames from "classnames";
import { useState } from "react";

const ReduxDogImageContainer = ({
  imageUrl,
  breed,
  index,
}: {
  imageUrl: string;
  breed: string;
  index: number;
}) => {
  const [visible, setVisible] = useState<boolean>(true); // true = visible
  return (
    <button
      className={classNames(
        "relative w-30 h-30 flex flex-col align-start justify-start",
        {
          hidden: !visible,
        },
      )}
      key={imageUrl}
      type="button"
      onClick={() => {
        setVisible((prev) => !prev);
      }}
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
    </button>
  );
};

export default ReduxDogImageContainer;

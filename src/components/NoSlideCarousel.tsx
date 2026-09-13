import classNames from "classnames";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

const NoSlideCarousel = ({
  className,
  imageUrls,
  totalImages,
}: {
  className?: string;
  imageUrls: string[];
  totalImages: number;
}) => {
  // SSOT for index of image currently shown
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // decrement currentIndex but circle back to last if ended up on first
  const onLeftClick = () => {
    if (currentIndex === 0) {
      setCurrentIndex(totalImages);
      return;
    }
    if (currentIndex !== 0) {
      setCurrentIndex((prev) => prev - 1);
      return;
    }
  };

  // increment currentIndex but circle back to first if ended up on last
  const onRightClick = () => {
    if (currentIndex === totalImages) {
      setCurrentIndex(0);
      return;
    }
    if (currentIndex !== totalImages) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }
  };

  return (
    <div
      className={classNames(
        "bound relative block w-full h-120 flex flex-row border-3 border-amber-500 overflow-hidden",
        className,
      )}
    >
      <div className="overlay absolute w-full h-full block flex flex-col align-center justify-center z-10">
        <div className="button-row flex flex-row w-full justify-between align-center px-20">
          <Button
            variant="outline"
            size="icon"
            aria-label="button"
            type="button"
            className="left-button"
            onClick={onLeftClick}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="button"
            type="button"
            className="right-button"
            onClick={onRightClick}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
      {imageUrls.map((url, index) => {
        return (
          <div
            key={url}
            className={classNames(
              "image-holder",
              "absolute top-0 left-0 right-0 bottom-0 block w-full h-full",
              {
                hidden: index !== currentIndex,
              },
            )}
          >
            <div className="absolute top-2 right-2 block border-3 border-red-900 block bg-slate-300 z-10 p-3">
              <h1 className="text-lg font-extrabold text-white-900">
                {index} / {totalImages}
              </h1>
            </div>
            <img
              src={url}
              alt={`carousel-image--${index}`}
              className={classNames("object-cover block w-full h-full")}
            />
          </div>
        );
      })}
    </div>
  );
};

export default NoSlideCarousel;

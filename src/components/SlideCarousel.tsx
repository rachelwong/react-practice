import classNames from "classnames";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

const SlideCarousel = ({
  className,
  imageUrls,
  totalImages,
}: {
  className?: string;
  imageUrls: string[];
  totalImages: number;
}) => {
  // SSOT which image in the whole list is displayed RIGHT NOW
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // tells each image how much to change their current position/index
  // -1 move every image's current position to the left
  // 0 no move
  // + move every image's current position to the right
  const [slideBy, setSlideBy] = useState<0 | 1 | -1>(0);

  // set which image in the list to show NEXT
  // promise of where we are going
  const [targetIndex, setTargetIndex] = useState<number | null>(null);

  // on/off switch to control how movement is smooth or instant
  // mainly to stop when currentIndex changes to a new value
  const [skipTransition, setSkipTransition] = useState<boolean>(false);

  // clean up after the slide
  // updates the which image is to be the currently shown one
  // update own memory of which image is currently shown to allow for the next click
  const onSlideFinished = () => {
    // do nothing when carousel first loads as no transition happened
    if (targetIndex === null) {
      return;
    }
    setSkipTransition(true);
    // setting where we are going NEXT to be the current index so that it catches up with the css transition
    setCurrentIndex(targetIndex);

    // reset
    setSlideBy(0);
    setTargetIndex(null);

    // run the callback before browser draws next frame
    requestAnimationFrame(() => setSkipTransition(false));
  };
  // calculate how far away each image on the list is from the one currently shown
  const getImageSlot = ({
    imageIndex,
    currentIndex,
  }: {
    imageIndex: number;
    currentIndex: number;
  }) => {
    let nextIndex: number = 0; // index of the image on the list to be shown next
    let previousIndex: number = 0; // index of the image on the list to be shown previous

    // If currently shown image is the last one on the list
    if (currentIndex === totalImages) {
      nextIndex = 0;
    }
    // If currently shown image is NOT the last one on the list
    if (currentIndex !== totalImages) {
      nextIndex = currentIndex + 1;
    }

    // if currently shown image is the first one on the list
    if (currentIndex === 0) {
      previousIndex = totalImages;
    }
    // if currently shown image is NOT the first one on the list
    if (currentIndex !== 0) {
      previousIndex = currentIndex - 1;
    }

    // if this image on the list is the one currently shown, no need to move
    if (imageIndex === currentIndex) {
      return 0;
    }

    // if this image on the list is the next one to be shown, BE ON THE RIGHT
    if (imageIndex === nextIndex) {
      return 1;
    }
    // if this image ont he list is on the previous one to be shown, BE ON THE LEFT
    if (imageIndex === previousIndex) {
      return -1;
    }

    // if this image on the list is not current, or the next, or the previous one,
    // BE FAR AWAY (off-screen)
    return 2;
  };

  // setTargetIndex && setSlideBY triggerse a re-render
  // the style transform ruleset is recalculated
  // causing browser to animate from old transform value to the new one causing the SLIDE
  const onRightClick = () => {
    let nextIndex: number;
    // if showing last image on the list currently,
    // then next image to show is the first one
    if (currentIndex === totalImages) {
      nextIndex = 0;
      setTargetIndex(nextIndex);
      // currently shown image moves to the left
      // next image to move in from the right
      setSlideBy(-1);
      return;
    }
    // if NOT showing last image currently,
    // then show next image in the list
    if (currentIndex !== totalImages) {
      nextIndex = currentIndex + 1;
      setTargetIndex(nextIndex);
      // currently shown image moves to the left
      // next image to move in from the right
      setSlideBy(-1);
      return;
    }
  };

  const onLeftClick = () => {
    let nextIndex: number;

    // if showing first image on the list currently,
    // then show last image on the list
    if (currentIndex === 0) {
      nextIndex = totalImages;
      setTargetIndex(nextIndex);
      setSlideBy(1);
      return;
    }
    // if NOT showing the first image on the list currently
    // then shown the previous image on the list
    if (currentIndex !== 0) {
      nextIndex = currentIndex - 1;
      setTargetIndex(nextIndex);
      setSlideBy(1);
      return;
    }
  };

  return (
    <div
      className={classNames(
        "bound relative block w-full h-120 flex flex-row border-3 border-green-500 overflow-hidden",
        className,
      )}
      onTransitionEnd={onSlideFinished}
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
        const distanceOffset =
          getImageSlot({ imageIndex: index, currentIndex }) + slideBy;

        // image is not current/next/previous
        const imageNotImminent =
          Math.abs(getImageSlot({ imageIndex: index, currentIndex })) === 2;

        return (
          <div
            key={url}
            className={classNames(
              "absolute top-0 left-0 right-0 bottom-0 block w-full h-full",
              {
                "transition-transform duration-300 ease-out":
                  !skipTransition && !imageNotImminent,
                "z-4": !imageNotImminent,
              },
            )}
            style={{
              // moves images that are not current/next/previous
              // lower down so they don't accidentally appear (they are z-index 0)
              // current on very top, followed by immediately next/previous, followed finally by far away images
              zIndex:
                2 - Math.abs(getImageSlot({ imageIndex: index, currentIndex })),
              transform: `translateX(${distanceOffset * 100}%)`,
            }}
          >
            <div className="absolute top-2 right-2 block border-3 border-red-900 block bg-slate-300 z-10 p-3">
              <h1 className="text-lg font-extrabold text-white-900">
                {index} / {totalImages}
              </h1>
            </div>
            <img
              key={url}
              src={url}
              alt={`carousel-image--${index}`}
              className={classNames(
                "absolute top-0 left-0 right-0 bottom-0 object-cover block w-full h-full",
              )}
            />
          </div>
        );
      })}
    </div>
  );
};

export default SlideCarousel;

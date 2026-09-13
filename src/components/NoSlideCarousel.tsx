import classNames from "classnames";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const onLeftClick = () => {};
  const onRightClick = () => {};

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
      NoSlideCarousel
    </div>
  );
};

export default NoSlideCarousel;

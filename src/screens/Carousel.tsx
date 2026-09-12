import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import getImagesByDogBreed from "@/services/getImagesByDogBreed";
import classNames from "classnames";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const TEST_BREED_NAME = "beagle";
const TEST_IMAGE_NUM = 5;

const Carousel = () => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentIndex, setIndex] = useState<number>(0);
  const totalImages = imageUrls.length - 1;

  // increment but never beyond totalImages
  const onRightClick = () => {
    // not at the last image, add 1
    if (currentIndex < totalImages) {
      setIndex((prev) => prev + 1);
      return;
    }
    // if at the last image, go to the start
    if (currentIndex === totalImages) {
      setIndex(0);
      return;
    }
  };

  // decrement but never zero
  const onLeftClick = () => {
    // not at the last image, take 1
    if (currentIndex > 0) {
      setIndex((prev) => prev - 1);
      return;
    }
    // if at the first image, go to the end
    if (currentIndex === 0) {
      setIndex(totalImages);
      return;
    }
  };

  const getDogImages = async () => {
    try {
      setLoading(true);
      const response = await getImagesByDogBreed({
        breed: TEST_BREED_NAME,
        numImages: TEST_IMAGE_NUM,
      });
      if (
        response!.status.toString() !== "success" ||
        !response?.message.length
      ) {
        return;
      }
      setImageUrls(response.message);
    } catch (err) {
      console.error(`Unable to get dog images for carousel ${err}`);
      setImageUrls([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDogImages();
  }, []);

  return (
    <Layout
      heading={
        <>
          <h3 className="font-extrabold text-lg">Carousel</h3>
          <p>Custom carousel without packages dependencies</p>
          <p>
            Original brief from{" "}
            <a
              href="https://www.reactgrind.com/problems/react-carousel"
              target="_blank"
            >
              https://www.reactgrind.com/problems/react-carousel
            </a>
          </p>
        </>
      }
    >
      {loading && (
        <div className="loading">
          <Card className="w-full w-full flex flex-col">
            <CardHeader className="flex flex-col">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="aspect-video w-full" />
            </CardContent>
          </Card>
        </div>
      )}
      <p>currentIndex {JSON.stringify(currentIndex)}</p>
      <p>totalImages {JSON.stringify(totalImages)}</p>
      {!loading && imageUrls.length && (
        <div className="bound relative block w-full h-120 flex flex-row border-3 border-green-500">
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
              <img
                key={url}
                src={url}
                alt={`carousel-image--${index}`}
                className={classNames(
                  "absolute top-0 left-0 object-cover block w-full h-full",
                  {},
                )}
              />
            );
          })}
        </div>
      )}
    </Layout>
  );
};

export default Carousel;

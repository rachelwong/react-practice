import Layout from "@/components/Layout";
import NoSlideCarousel from "@/components/NoSlideCarousel";
import SlideCarousel from "@/components/SlideCarousel";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import getImagesByDogBreed from "@/services/getImagesByDogBreed";
import { useEffect, useState } from "react";

const TEST_BREED_NAME = "beagle";
const TEST_IMAGE_NUM = 5;

const Carousel = () => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const totalImages = imageUrls.length - 1; // normalised to match list index values

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
          <p>Custom carousels without packages dependencies</p>
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
      {!loading && imageUrls.length && (
        <>
          <h2 className="text-2xl font-extrabold mb-2">No Slide</h2>
          <NoSlideCarousel
            className="my-4"
            totalImages={totalImages}
            imageUrls={imageUrls}
          />
          <h1 className="text-2xl font-extrabold mb-2">
            Sliding with CSS transition{" "}
            <span className="text-sm">(Claude Code helped with solution)</span>
          </h1>
          <SlideCarousel
            className="my-4"
            totalImages={totalImages}
            imageUrls={imageUrls}
          />
        </>
      )}
    </Layout>
  );
};

export default Carousel;

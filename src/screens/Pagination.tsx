import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import getImages from "@/services/getImages";
import type { ImageProfile } from "@/services/types/ImageResponse";
import classNames from "classnames";
import { useEffect, useState } from "react";

const NUM_IMAGES_PER_PAGE = 2;

const Pagination = () => {
  const [data, setData] = useState<ImageProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // number of the current page
  const [currentPage, setCurrentPage] = useState<number>(0);

  const numberOfPages = data.length / NUM_IMAGES_PER_PAGE;
  const numPageButtons = Array.from(Array(numberOfPages).keys());

  // index of the first image to display
  const startIndex = currentPage * NUM_IMAGES_PER_PAGE;

  const lastPage = numPageButtons.length - 1;

  const getData = async () => {
    try {
      setLoading(true);
      const response = await getImages();
      if (!response?.length) {
        return;
      }
      setData(response.slice(0, 12));
    } catch (err) {
      console.error(`Error in pagination ${err}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Layout
      heading={
        <>
          <h3>Pagination without load more</h3>
          <p>
            Original brief here{" "}
            <a
              href="https://www.reactgrind.com/problems/react-pagination"
              target="_blank"
            >
              https://www.reactgrind.com/problems/react-pagination
            </a>
          </p>
        </>
      }
    >
      <div className="w-full h-full relative block">
        {loading && <p>Loading ...</p>}
        <p>currentPage {JSON.stringify(currentPage)}</p>

        {!loading && !!data.length && (
          <div className="relative mx-auto my-0 flex flex-col align-start justify-start">
            <div className="image-holder flex flex-row w-full align-center justify-center block">
              {data.map((x, index) => (
                <div
                  className={classNames("w-30 h-30 block relative", {
                    // hide any images that is previous
                    // hide any images that is more than 2 images ahead of the current one
                    hidden:
                      index < startIndex ||
                      index >= startIndex + NUM_IMAGES_PER_PAGE,
                  })}
                  key={x.id}
                >
                  {index}
                  <img
                    src={x.download_url}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="controls flex flex-row align-center justify-center gap-x-3 relative">
              <Button
                variant="outline"
                disabled={currentPage === 0}
                onClick={() => {
                  setCurrentPage((prev) => prev - 1);
                }}
              >
                Prev
              </Button>
              <div className="pages flex flex-row gap-x-3">
                {numPageButtons.map((x) => {
                  return (
                    <Button
                      key={x}
                      className=""
                      variant="outline"
                      onClick={() => {
                        setCurrentPage(x);
                      }}
                    >
                      {x + 1}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                disabled={currentPage === lastPage}
                onClick={() => {
                  setCurrentPage((prev) => prev + 1);
                }}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Pagination;

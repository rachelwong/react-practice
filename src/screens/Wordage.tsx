import ScreenLayout from "@/components/ScreenLayout";
import { Button } from "@/components/ui/button";
import WordageItemBrowser from "@/components/WordageItemBrowser";
import { randomShuffleArray } from "@/utils";
import { CornerRightDown, Lightbulb } from "lucide-react";
import { useState, type DragEvent } from "react";

const GAME_ITEMS = ["red", "orange", "yellow", "green", "blue", "purple"]; // winning order

const MAX_TRIES = 3;
const MAX_HINTS = 2;

const START_ZONE = "start";
const DROP_ZONE = "drop";

const BROWSER_SIZE = 3;

export type WordageZoneType = typeof START_ZONE | typeof DROP_ZONE;
export type WordageItem = {
  id: string;
  zone: string;
};

const Wordage = () => {
  const [submitTries, setSubmitTries] = useState<number>(0); // max 3
  const [hintTries, setHintTries] = useState<number>(0); // 2
  const [gameItems, setGameItems] = useState<WordageItem[]>(() => {
    return randomShuffleArray({ items: GAME_ITEMS }).map((x, i) => {
      if (i === 0) {
        return {
          id: x,
          zone: DROP_ZONE,
        };
      }
      return { id: x, zone: START_ZONE };
    });
  });

  const [currDrag, setCurrDrag] = useState<WordageItem | null>(null);

  const startItems = gameItems.filter((x) => x.zone === START_ZONE);

  const numStartItems = startItems.length;

  const disableSubmit =
    !!numStartItems || (!numStartItems && submitTries === MAX_TRIES);

  const disableHint =
    !!numStartItems || (!numStartItems && hintTries === MAX_HINTS);

  const handleDragStart = (id: string, zone: WordageZoneType) => {
    const item = gameItems.find((x) => x.id === id) || null;

    // Without this delay, React hides the element before the browser takes its picture.
    // The element under your cursor then comes out blank or invisible too.
    // setTimeout lets the browser take the picture first, and the original hides right after.
    setTimeout(() => {
      setCurrDrag(item);
    }, 0);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragItem = () => {
    setCurrDrag(null);
  };

  const handleDragDrop = (zone: WordageZoneType) => {
    if (!currDrag) {
      return;
    }

    setGameItems((prev) => {
      return [
        ...prev.map((x) => {
          return x.id === currDrag.id ? { ...x, zone: zone } : x;
        }),
      ];
    });
    setCurrDrag(null);
  };

  return (
    <ScreenLayout
      title="Wordage Quiz"
      brief="https://www.abc.net.au/news/2026-10-04/abc-wordage-quiz/107211586"
      description={
        <>
          <p>Inspired by ABC Wordage Quiz</p>
          <ul className="list-disc pl-2">
            <li>
              Initial start zone disappears after all items dragged into active
              drop zone
            </li>
            <li>Has Submit button (3 tries) and Hint button (2 tries)</li>
            <li>Win = all items in the correct order</li>
            <li>
              Hint button triggers a random rolling lottery through the items
              that gradually slows down . The item that it lands on, it
              evaluates in two ways:
              <ol className="list-decimal pl-3">
                <li>If it is correct, show a tick</li>
                <li>
                  If it is incorrect, move it to the correct position, replacing
                  the current item. The replaced item is moved to the bottom of
                  the list
                </li>
              </ol>
            </li>
            <li>
              If currently dragged item is above a list item, then it will be
              ordered before it. If it is below it, then ordered after it. It
              doesn't evaluate order when dragged over.
            </li>
            <li>Stretch: re-number the list order on drag.</li>
          </ul>
        </>
      }
    >
      <div className="mx-auto max-w-4xl w-full h-auto flex flex-col items-center justify-start">
        <h1 className="text-3xl mb-10 text-center">
          Order these rainbow colours {JSON.stringify(currDrag?.id)}
        </h1>
        <div className="w-full h-auto flex flex-col items-center justify-start gap-y-5">
          {!!numStartItems && (
            <WordageItemBrowser
              allAvailableStartItems={startItems}
              pageSize={BROWSER_SIZE}
              onDragStart={(id) => handleDragStart(id, START_ZONE)}
              onDrop={() => handleDragDrop(START_ZONE)}
              onDragOver={(e) => handleDragOver(e)}
              currDragId={currDrag?.id ?? null}
              onDragEnd={() => handleDragItem()}
            />
          )}
          <div className="w-full h-full flex flex-col items-start justify-start gap-y-6">
            {!!numStartItems && (
              <div className="flex flex-row items-center justify-center gap-x-4 py-4 text-neutral-400 font-extrabold w-full">
                <p className="uppercase">
                  Items {numStartItems} / {gameItems.length}
                </p>
                <CornerRightDown />
              </div>
            )}
            <div className="flex flex-col items-start justify-start w-full h-full drop-zone rounded-lg bg-neutral-100 p-6 ">
              {gameItems
                .filter((x) => x.zone === DROP_ZONE)
                .map((item, itemIndex) => {
                  return (
                    <div
                      key={item.id}
                      className="w-full rounded-lg overflow-hidden bg-blue-200 h-10 border-1 border-neutral-300 flex flex-row justify-start items-center"
                    >
                      <div className="item-number w-10 h-full bg-blue-500 text-white flex flex-col items-center justify-center">
                        {itemIndex + 1}
                      </div>
                      <div className="text-blue-900 font-extrabold px-6">
                        <span>{item.id}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="flex flex-row items-center justify-center gap-x-10 w-full h-auto mb-10">
              <Button
                size="lg"
                disabled={disableSubmit}
                onClick={() => {}}
                className="p-6"
              >
                Submit {submitTries}/{MAX_TRIES}
              </Button>
              <Button
                size="lg"
                disabled={disableHint}
                onClick={() => {}}
                className="p-6"
              >
                <Lightbulb />
                Hint {hintTries}/{MAX_HINTS}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ScreenLayout>
  );
};

export default Wordage;

import {
  AFTER_TARGET,
  BEFORE_TARGET,
  BROWSER_SIZE,
  CORRECT_POS,
  DROP_ZONE,
  GAME_ITEMS,
  GAME_STATUS,
  HINT_OPTIONS,
  MAX_HINTS,
  MAX_TRIES,
  SHOW_ALREADY_CORRECT,
  START_ZONE,
  type DropTarget,
  type WordageItem,
  type WordageZoneType,
} from "@/constants/Wordage";
import { randomShuffleArray } from "@/utils";
import { decode } from "html-entities";
import {
  CircleCheck,
  CircleX,
  CornerRightDown,
  Lightbulb,
  RotateCcw,
} from "lucide-react";
import { Fragment, useState, type DragEvent } from "react";
import WordageItemBrowser from "./WordageItemBrowser";
import { Button } from "./ui/button";

const swapItems = ({
  list,
  indexA,
  indexB,
}: {
  list: WordageItem[];
  indexA: number;
  indexB: number;
}) => {
  // 1. Create a shallow copy of the array
  const copy = [...list];

  // 2. Swap elements on the copy using destructuring
  [copy[indexA], copy[indexB]] = [copy[indexB], copy[indexA]];

  return copy;
};

const getGameStatus = ({
  ready,
  lastSubmissionCorrect,
  outofSubmissionTries,
}: {
  ready: boolean;
  lastSubmissionCorrect: boolean;
  outofSubmissionTries: boolean;
}) => {
  if (!ready) {
    return GAME_STATUS.PLACING;
  }
  // don't need ready check as above block early returns
  if (lastSubmissionCorrect) {
    return GAME_STATUS.WON;
  }
  if (outofSubmissionTries) {
    return GAME_STATUS.LOST;
  }
  return GAME_STATUS.PLAYING;
};

const RoughWordage = () => {
  const [hintTries, setHintTries] = useState<number>(0);
  // TODO modify this so that random shuffle will not accidently resolve into correct positioned items
  const [gameItems, setGameItems] = useState<WordageItem[]>(() => {
    return randomShuffleArray({ items: GAME_ITEMS }).map((x, i) => {
      if (i === 0) {
        return {
          id: x,
          zone: DROP_ZONE,
          status: null,
        };
      }
      return { id: x, zone: START_ZONE, status: null };
    });
  });
  const [submissions, setSubmissions] = useState<WordageItem[][]>([]);

  const [currDrag, setCurrDrag] = useState<WordageItem | null>(null);
  // blank space has to be drawn while you're dragging
  // React only redraws when state changes, so "which item, and which half" has to live in state during the drag.
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);

  const startItems = gameItems.filter((x) => x.zone === START_ZONE);

  const droppedItems = gameItems.filter((x) => x.zone === DROP_ZONE);

  const numStartItems = startItems.length;

  const numDropItems = droppedItems.length;

  const allItemsReady = numDropItems === gameItems.length;

  const lastSubmission = submissions.at(-1) || [];

  const lastSubmissionWon =
    lastSubmission.length > 0 &&
    lastSubmission.every((x, index) => GAME_ITEMS[index] === x.id);

  const gameStatus = getGameStatus({
    ready: allItemsReady,
    lastSubmissionCorrect: lastSubmissionWon,
    outofSubmissionTries: submissions.length === MAX_TRIES,
  });

  const gameOver =
    gameStatus === GAME_STATUS.WON || gameStatus === GAME_STATUS.LOST;

  // adding comma prevents letter collision
  // i.e. ['a', 'bc'] and ['ab', 'c'] both joins to 'abc'
  const unchangedSubmission =
    lastSubmission.map((x) => x.id)?.join(",") ===
    droppedItems.map((x) => x.id).join(",");

  const itemsWrong = gameItems.filter((x, index) => GAME_ITEMS[index] !== x.id);

  const handleSubmission = () => {
    // don't count a submit if nothing changed
    if (gameStatus !== GAME_STATUS.PLAYING || unchangedSubmission) {
      return;
    }

    const validatedDroppedItems: WordageItem[] = droppedItems.map(
      (x, index): WordageItem => {
        if (GAME_ITEMS.findIndex((y) => y === x.id) === index) {
          return {
            ...x,
            status: CORRECT_POS,
          };
        }
        return x;
      },
    );
    // TODO Resolve drift-risk between submissions & gameItems
    setSubmissions((prev) => [...prev, validatedDroppedItems]);

    setGameItems((prev) => {
      return [
        ...prev.map((x, index): WordageItem => {
          if (GAME_ITEMS.findIndex((y) => y === x.id) === index) {
            return {
              ...x,
              status: CORRECT_POS,
            };
          }
          return x;
        }),
      ];
    });
  };

  // find first incorrect answer and move it to the correct position
  const findReplaceIncorrectAnswer = () => {
    // Check whether each item is right using its real position,
    // Never filter first and then use index.
    const currentWrongItems = gameItems.filter(
      (x, index) => GAME_ITEMS[index] !== x.id && x.zone === DROP_ZONE,
    );

    if (!currentWrongItems.length) {
      return;
    }

    const randomFirstWrongAnswer = randomShuffleArray({
      items: currentWrongItems,
    })[0];

    const randomWrongAnswerPos = gameItems.findIndex(
      (x) => randomFirstWrongAnswer.id === x.id,
    );

    if (randomWrongAnswerPos === -1) {
      return;
    }

    const correctPosition = GAME_ITEMS.indexOf(randomFirstWrongAnswer.id);

    const updatedGameItems = swapItems({
      list: gameItems,
      indexA: correctPosition,
      indexB: randomWrongAnswerPos,
    })
      // update that item's status
      .map((x): WordageItem => {
        return x.id === randomFirstWrongAnswer.id
          ? { ...x, status: CORRECT_POS }
          : x;
      });

    setGameItems(updatedGameItems);
  };

  const handleHintTries = () => {
    if (!itemsWrong.length) {
      return;
    }

    const selectedHintAction =
      HINT_OPTIONS[Math.floor(Math.random() * HINT_OPTIONS.length)];

    if (selectedHintAction === SHOW_ALREADY_CORRECT) {
      const firstCorrectAnswer = gameItems.find(
        (x, index) => GAME_ITEMS[index] === x.id && x.status === null,
      );

      if (!firstCorrectAnswer) {
        findReplaceIncorrectAnswer();
      } else {
        setGameItems((prev) => {
          return prev.map((x) => {
            if (x.id === firstCorrectAnswer?.id) {
              return {
                ...x,
                status: CORRECT_POS,
              };
            }
            return x;
          });
        });
      }
    } else {
      findReplaceIncorrectAnswer();
    }

    setHintTries((prev) => {
      return prev < MAX_HINTS ? prev + 1 : prev;
    });
  };

  const resetDragState = () => {
    setCurrDrag(null);
    setDropTarget(null);
  };

  const handleDragStart = (id: string, zone: WordageZoneType) => {
    const item = gameItems.find((x) => x.id === id) || null;
    if (!item) {
      return;
    }
    // Without this delay, React hides the element before the browser takes its picture.
    // The element under your cursor then comes out blank or invisible too.
    // setTimeout lets the browser take the picture first, and the original hides right after.
    setTimeout(() => {
      setCurrDrag({ ...item, zone });
    }, 0);
  };

  const handleDragOver = ({
    event,
    targetId,
    zone,
  }: {
    event: DragEvent<HTMLDivElement>;
    targetId?: string;
    zone: WordageZoneType;
  }) => {
    event.preventDefault();

    // don't handle dropTarget calc when dragging over start zone
    // can't drag from drop to start
    if (zone === START_ZONE) {
      return;
    }
    event.stopPropagation();

    // when middle of current draggable item past the top of the target item
    // move targetItem and all subsequent item downwards
    // create space

    // when middle of current draggable item past the bottom of the target item
    // move targetItem and all higher items upwards
    // create space

    const rect = event.currentTarget.getBoundingClientRect();
    const middleYPos = rect.top + rect.height / 2;
    // which half of the hovered target item your cursor is over right now.
    const position = event.clientY < middleYPos ? BEFORE_TARGET : AFTER_TARGET;

    // don't update drop target if no drag-over target
    if (!targetId) {
      return;
    }
    // reset drop target if dragging over itself
    if (currDrag?.id === targetId) {
      if (dropTarget) {
        setDropTarget(null);
      }
      return;
    }
    // don't update drop target if dragging over same item and cursor pos has not changed
    if (dropTarget?.id === targetId && dropTarget.position === position) {
      return;
    }

    setDropTarget({ id: targetId, position });
  };

  const handleDragEnd = () => {
    resetDragState();
  };

  const handleDrop = ({
    zone,
    targetItemId,
  }: {
    zone: WordageZoneType;
    targetItemId?: string;
  }) => {
    // cancel dropping for
    // // dropped on itself
    // // dropping within start zone
    // // dropping from drop to start
    if (
      !currDrag ||
      (currDrag.zone === DROP_ZONE && zone === START_ZONE) ||
      (currDrag.zone === START_ZONE && zone == START_ZONE) ||
      targetItemId === currDrag.id
    ) {
      resetDragState();
      return;
    }

    setGameItems((prev) => {
      // Start item dropped above or below an item in the list: it goes in at that spot.
      // Start item dropped with nothing hovered: it goes to the end. In practice that means an empty drop zone, or letting go in the padding before touching any item.
      // Drop-zone item with nothing hovered: nothing changes.

      if (!dropTarget) {
        if (currDrag.zone !== START_ZONE) {
          return prev;
        }
        return [...prev.filter((x) => x.id !== currDrag.id), currDrag];
      }
      const others = prev.filter((x) => x.id !== currDrag.id);

      // split up remaining items by position of the dragged over item
      // to insert the currDrag in the middle
      const indexForDraggedOverItem = others.findIndex(
        (x) => x.id === dropTarget.id,
      );

      // if can't find the dragoveritem, then do nothing instead
      if (indexForDraggedOverItem === -1) {
        return prev;
      }

      const slicePoint =
        dropTarget.position === BEFORE_TARGET
          ? indexForDraggedOverItem
          : indexForDraggedOverItem + 1;

      const before = others.slice(0, slicePoint);
      const after = others.slice(slicePoint);
      const updatedList = [...before, currDrag, ...after];

      const movableItems = updatedList.filter((x) => x.status !== CORRECT_POS);

      // correct items keep position
      // every other slot takes the next movable item
      // .shift() removes the first item of movableItems and returns it,
      // there are always exactly as many movable items as open slots.
      return prev.map((x) =>
        x.status === CORRECT_POS ? x : movableItems.shift()!,
      );
    });

    // Not dragging on top of another item
    // Not dragging from start to drop
    if (!targetItemId || (currDrag.zone === START_ZONE && zone === DROP_ZONE)) {
      setGameItems((prev) => {
        return [
          ...prev.map((x) => {
            return x.id === currDrag.id ? { ...x, zone: zone } : x;
          }),
        ];
      });
    }

    resetDragState();
  };

  const resetGame = () => {
    setHintTries(0);
    const newItems = randomShuffleArray({ items: GAME_ITEMS }).map((x, i) => {
      if (i === 0) {
        return {
          id: x,
          zone: DROP_ZONE,
          status: null,
        };
      }
      return { id: x, zone: START_ZONE, status: null };
    });
    setGameItems(newItems);
    setSubmissions([]);
    resetDragState();
  };
  return (
    <div className="flex flex-col w-full h-auto items-start justify-start gap-y-6">
      <h1 className="text-3xl mb-10 text-center">Order these colours</h1>
      <div className="w-full h-auto flex flex-col items-center justify-start gap-y-5">
        {!!numStartItems && (
          <WordageItemBrowser
            allAvailableStartItems={startItems}
            pageSize={BROWSER_SIZE}
            onDragStart={(id) => handleDragStart(id, START_ZONE)}
            onDrop={() => handleDrop({ zone: START_ZONE })}
            onDragOver={(e) => handleDragOver({ event: e, zone: START_ZONE })}
            currDragId={currDrag?.id ?? null}
            onDragEnd={() => handleDragEnd()}
          />
        )}
        <div className="w-full h-full flex flex-col items-start justify-start gap-y-6">
          {/* when not all items are in the drop zone */}
          {gameStatus === GAME_STATUS.PLACING && (
            <div className="flex flex-row items-center justify-center gap-x-4 py-4 text-neutral-400 font-extrabold w-full">
              <p className="uppercase">
                {gameItems.length - 1 === numStartItems
                  ? `Drag and place ${numStartItems} items from start to end`
                  : `Items ${numDropItems} / ${gameItems.length}`}
              </p>
              <CornerRightDown />
            </div>
          )}
          {gameStatus === GAME_STATUS.PLAYING && (
            <div className="flex flex-row items-center justify-center gap-x-4 py-4 text-neutral-400 font-extrabold w-full">
              Feeling confident? Hit submit
            </div>
          )}
          {gameStatus === GAME_STATUS.WON && (
            <div className="flex flex-row items-center justify-center gap-x-4 py-4 text-neutral-400 font-extrabold w-full">
              <span>{decode("&#9989;")} </span>
              <p className="uppercase">Quiz completed!</p>
            </div>
          )}
          {gameStatus === GAME_STATUS.LOST && (
            <div className="flex flex-row items-center justify-center gap-x-4 py-4 text-neutral-400 font-extrabold w-full">
              <span>{decode("&#10060;")} </span>
              <p className="uppercase">
                {`${gameItems.length - itemsWrong.length} / ${gameItems.length} correct`}
              </p>
            </div>
          )}
          <div
            className="flex flex-col items-start justify-start w-full h-full drop-zone rounded-lg bg-neutral-100 p-6 gap-y-6"
            onDragOver={(e) => handleDragOver({ event: e, zone: DROP_ZONE })}
            onDrop={() => handleDrop({ zone: DROP_ZONE })}
          >
            {droppedItems.map((item, itemIndex) => {
              const currItemDraggedOver = dropTarget?.id === item.id;
              const placeholderSpace = (
                <div className="w-full h-10 shrink-0 rounded-lg border-2 border-dashed border-sky-300" />
              );

              const correctItem =
                gameOver &&
                GAME_ITEMS.findIndex((x) => item.id === x) === itemIndex;

              const bgColour = !gameOver
                ? "bg-sky-100"
                : correctItem
                  ? "bg-green-500"
                  : "bg-red-500";

              return (
                <Fragment key={item.id}>
                  {/* display a placeholder space BEFORE current item */}
                  {currItemDraggedOver &&
                    dropTarget.position === BEFORE_TARGET &&
                    placeholderSpace}
                  <div
                    className={`${bgColour} w-full rounded-lg overflow-hidden h-10 border-1 border-neutral-300 flex flex-row justify-start items-center ${!gameOver && item.status !== CORRECT_POS ? "hover:cursor-grab" : ""} ${!!currDrag ? "cursor-grabbing" : ""}`}
                    // prevent cards being draggable after loss/win
                    draggable={!gameOver && item.status !== CORRECT_POS}
                    onDragStart={() => handleDragStart(item.id, DROP_ZONE)}
                    onDragOver={(e) =>
                      handleDragOver({
                        event: e,
                        zone: DROP_ZONE,
                        targetId: item.id,
                      })
                    }
                  >
                    <div className="item-number w-10 h-full bg-sky-700 text-white flex flex-col items-center justify-center">
                      {!gameOver ? (
                        itemIndex + 1
                      ) : correctItem ? (
                        <CircleCheck />
                      ) : (
                        <CircleX />
                      )}
                    </div>
                    <div className="text-sky-900 w-full h-auto font-extrabold px-6 flex flex-row justify-between items-center">
                      <span>{item.id}</span>
                      {!gameOver &&
                        !!item.status &&
                        (item.status === CORRECT_POS ? (
                          <CircleCheck className="text-white fill-sky-700" />
                        ) : (
                          <CircleX className="text-white fill-sky-700" />
                        ))}
                    </div>
                  </div>
                  {/* display a placeholder space AFTER current item */}
                  {currItemDraggedOver &&
                    dropTarget.position === AFTER_TARGET &&
                    placeholderSpace}
                </Fragment>
              );
            })}
          </div>
          <div className="flex flex-row items-center justify-center gap-x-10 w-full h-auto mb-10">
            <Button
              size="lg"
              disabled={
                gameStatus !== GAME_STATUS.PLAYING || unchangedSubmission
              }
              onClick={() => {
                handleSubmission();
              }}
              className="p-6 bg-sky-700"
            >
              Submit {submissions.length}/{MAX_TRIES}
            </Button>
            <Button
              variant="outline"
              className="p-6"
              onClick={() => resetGame()}
            >
              <RotateCcw />
              Reset game
            </Button>
            <Button
              size="lg"
              disabled={
                gameStatus !== GAME_STATUS.PLAYING || hintTries === MAX_HINTS
              }
              onClick={() => {
                handleHintTries();
              }}
              className="p-6 bg-neutral-500"
            >
              <Lightbulb />
              Hint {hintTries}/{MAX_HINTS}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoughWordage;

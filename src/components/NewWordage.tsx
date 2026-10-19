import { GAME_ITEMS, GAME_STATUS } from "@/constants/Wordage";
import useWordage from "@/hooks/useWordage";
import { Lightbulb, RotateCcw } from "lucide-react";
import NewWordageGameItem from "./NewWordageGameItem";
import NewWordageResult from "./NewWordageResult";
import { Button } from "./ui/button";

const NewWordage = () => {
  const {
    state,
    gameStatus,
    disableGetHint,
    disableSubmit,
    numberCorrectItems,
    onSubmit,
    onGetHint,
    reset,
    onReveal,
  } = useWordage({
    answer: GAME_ITEMS,
  });

  const {
    submitsUsed,
    maxSubmitCount,
    hintsUsed,
    maxHintCount,
    lastSubmitCorrectCount,
  } = state;

  const gameOver =
    gameStatus === GAME_STATUS.WON || gameStatus === GAME_STATUS.LOST;
  return (
    <div className="w-full h-auto flex flex-col items-start justify-start gap-y-6">
      <div className="start-zone"></div>
      <NewWordageResult
        gameStatus={gameStatus}
        numGameItems={state.inGameItems.length}
        numStartItems={state.startItems.length}
        numberCorrect={numberCorrectItems}
        lastSubmitCorrectCount={lastSubmitCorrectCount}
      />
      <div className="flex flex-col gap-y-15 items-start justify-start gap-y-15">
        <div className="drop-zone flex flex-col gap-y-6 items-start justify-start rounded-lg bg-neutral-100 p-6">
          {state.inGameItems.map((gameItem, gameItemIndex) => {
            return (
              <NewWordageGameItem
                isDraggable={!gameOver && !gameItem.confirmedCorrect}
                key={gameItem.value}
                item={gameItem}
                itemIndex={gameItemIndex}
                onDragOver={({ event, zone, targetIndex }) => {
                  console.log(event, zone, targetIndex);
                }}
                itemToDropBefore={false}
                itemToDropAfter={false}
                gameOver={gameOver}
                onDragStart={({ currentIndex, zone }) => {
                  console.log(currentIndex, zone);
                }}
                isDragged={false}
              />
            );
          })}
        </div>
        <div className="controls">
          <Button
            size="lg"
            disabled={disableSubmit}
            onClick={() => {
              onSubmit();
            }}
            className="p-6 bg-sky-700"
          >
            Submit {submitsUsed}/{maxSubmitCount}
          </Button>
          {gameStatus === GAME_STATUS.LOST && (
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                onReveal();
              }}
              className="p-6"
            ></Button>
          )}
          <Button variant="outline" className="p-6" onClick={() => reset()}>
            <RotateCcw />
            Reset game
          </Button>
          <Button
            size="lg"
            disabled={disableGetHint}
            onClick={() => {
              onGetHint();
            }}
            className="p-6 bg-neutral-500"
          >
            <Lightbulb />
            Hint {hintsUsed}/{maxHintCount}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewWordage;

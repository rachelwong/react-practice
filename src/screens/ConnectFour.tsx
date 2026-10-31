import ScreenLayout from "@/components/ScreenLayout";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const MAX = {
  ROW: 6,
  COL: 7,
};

const PLAYER = {
  RED: "red",
  YELLOW: "yellow",
} as const;

type PlayerType = (typeof PLAYER)[keyof typeof PLAYER] | null;

const ConnectFour = () => {
  const [gameState, setGame] = useState<(PlayerType | null)[][]>(() => {
    return Array.from({ length: MAX.COL }, () => Array(MAX.ROW).fill(null));
  });
  const [turn, setTurn] = useState<boolean>(false); // false = red, true = yellow

  const handleTurn = (colIndex: number) => {
    const currentTurn = turn ? PLAYER.YELLOW : PLAYER.RED;
    let unclaimedIndex: number = gameState[colIndex].findLastIndex(
      (x) => x === null,
    );

    if (unclaimedIndex === -1 || unclaimedIndex === undefined) {
      return;
    }

    setGame((prev) => {
      const newGame = prev.map((column) => [...column]);
      newGame[colIndex][unclaimedIndex] = currentTurn;
      return newGame;
    });
  };

  const validateGame = () => {};

  const reset = () => {
    setGame(Array.from({ length: MAX.COL }, () => Array(MAX.ROW).fill(null)));
    setTurn(false);
  };

  useEffect(() => {
    if (gameState.every((col) => col.every((rowVal) => rowVal === null))) {
      // dont invert turn when resetting game
      return;
    }
    setTurn((prev) => !prev);
    validateGame();
  }, [gameState]);

  return (
    <ScreenLayout brief="https://www.reactchallenges.com/challenges/connect-four">
      <div className="max-w-5xl mx-auto w-full h-auto flex flex-col gap-y-4">
        <div className="flex flex-row justify-between items-center">
          <Button
            onClick={() => {
              reset();
            }}
          >
            Reset
          </Button>
          <div className="flex flex-row justify-end items-center gap-x-5">
            Turn:{" "}
            <div
              className={`rounded-full w-10 h-10 bg-${turn ? PLAYER.YELLOW : PLAYER.RED}-400`}
            />
          </div>
        </div>
        <div
          className={`bg-sky-800 p-4 w-full h-auto grid grid-cols-${gameState.length} gap-4 grid-flow-row`}
        >
          {gameState.map((gameCol, colIndex) => {
            return (
              <button
                onClick={() => {
                  handleTurn(colIndex);
                }}
                className={`row w-full grid grid-rows-${gameCol.length} gap-4 grid-flow-col`}
              >
                {gameCol.map((rowVal, rowIndex) => {
                  return (
                    <button
                      type="button"
                      onClick={() => {
                        handleTurn(colIndex);
                      }}
                      className={`row rounded-full w-30 h-30 flex flex-col justify-center items-center ${rowVal === null ? "bg-white" : `bg-${rowVal}-400`}`}
                    >
                      ({rowIndex}, {colIndex})
                    </button>
                  );
                })}
              </button>
            );
          })}
        </div>
      </div>
    </ScreenLayout>
  );
};

export default ConnectFour;

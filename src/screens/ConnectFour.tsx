import ScreenLayout from "@/components/ScreenLayout";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const MAX = {
  ROW: 6,
  COL: 7,
};

const PLAYER = {
  RED: "RED",
  YELLOW: "YELLOW",
} as const;

type PlayerType = (typeof PLAYER)[keyof typeof PLAYER] | null;

const ConnectFour = () => {
  const [gameState, setGame] = useState<PlayerType[][]>(() => {
    return Array.from({ length: MAX.ROW }, () => Array(MAX.COL).fill(null));
  });
  const [turn, setTurn] = useState<boolean>(false); // false = red, true = yellow

  const handleTurn = (rowIndex: number, colIndex: number) => {};

  return (
    <ScreenLayout brief="https://www.reactchallenges.com/challenges/connect-four">
      <div className="max-w-5xl mx-auto w-full h-auto flex flex-col gap-y-4">
        <div className="flex flex-row justify-between items-center">
          <Button onClick={() => {}}>Reset</Button>
          <p>Turn: {turn ? "YELLOW" : "RED"}</p>
        </div>
        <div
          className={`bg-sky-800 p-4 w-full h-auto grid grid-rows-${gameState.length} gap-4 grid-flow-col`}
        >
          {gameState.map((gamerow, rowIndex) => {
            return (
              <div
                className={`row w-full grid grid-cols-${gamerow.length} gap-4 grid-flow-col`}
              >
                {gamerow.map((colVal, colIndex) => {
                  return (
                    <button
                      type="button"
                      onClick={() => {
                        handleTurn(rowIndex, colIndex);
                      }}
                      className={`col rounded-full w-30 h-30 flex flex-col justify-center items-center ${colVal === null ? "bg-white" : ""}`}
                    >
                      ({rowIndex}, {colIndex}) {JSON.stringify(colVal)}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </ScreenLayout>
  );
};

export default ConnectFour;

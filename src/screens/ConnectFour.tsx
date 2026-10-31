import ScreenLayout from "@/components/ScreenLayout";
import { Button } from "@/components/ui/button";
import classNames from "classnames";
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
  const [winner, setWinner] = useState<PlayerType | null>(null);
  const [latest, setLatest] = useState<{
    player: PlayerType;
    colIndex: number;
    rowIndex: number;
  } | null>(null);

  const handleTurn = (colIndex: number) => {
    const currentTurn = turn ? PLAYER.YELLOW : PLAYER.RED;
    let unclaimedIndex: number = gameState[colIndex].findLastIndex(
      (x) => x === null,
    );

    if (unclaimedIndex === -1 || unclaimedIndex === undefined) {
      return;
    }

    setLatest({ player: currentTurn, colIndex, rowIndex: unclaimedIndex });

    setGame((prev) => {
      const newGame = prev.map((column) => [...column]);
      newGame[colIndex][unclaimedIndex] = currentTurn;
      return newGame;
    });
  };

  const validateGame = () => {
    if (!latest) {
      return;
    }
    // eval latest turn
    // can build 4 x axis, y axis, diagonal x2
    const colWin = gameState[latest.colIndex]
      .join("")
      .includes(latest.player!.repeat(4));
    const rowWin = gameState
      .map((col) => col[latest.rowIndex])
      .join("")
      .includes(latest.player!.repeat(4));
    if (colWin || rowWin) {
      setWinner(latest.player);
    }
  };

  const reset = () => {
    setGame(Array.from({ length: MAX.COL }, () => Array(MAX.ROW).fill(null)));
    setTurn(false);
    setLatest(null);
    setWinner(null);
  };

  useEffect(() => {
    if (gameState.every((col) => col.every((rowVal) => rowVal === null))) {
      setLatest(null);
      // dont invert turn when resetting game
      return;
    }
    setTurn((prev) => !prev);
    validateGame();
  }, [gameState]);

  return (
    <ScreenLayout
      title="Connect four"
      brief="https://www.reactchallenges.com/challenges/connect-four"
    >
      <div className="max-w-5xl mx-auto w-full h-auto flex flex-col gap-y-4">
        <div className="flex flex-row justify-between items-center">
          <Button
            onClick={() => {
              reset();
            }}
          >
            Reset
          </Button>
          {winner && <p>{winner} has won!</p>}
          <div className="flex flex-row justify-end items-center gap-x-5">
            Turn:{" "}
            <div
              className={classNames(`rounded-full w-10 h-10`, {
                "bg-red-400": !turn,
                "bg-yellow-400": !!turn,
              })}
            />
          </div>
        </div>
        <div
          className={`${winner ? "bg-neutral-300" : "bg-sky-800"} p-4 w-full h-auto grid grid-cols-${gameState.length} gap-4 grid-flow-row`}
        >
          {gameState.map((gameCol, colIndex) => {
            return (
              <button
                disabled={!!winner}
                key={gameCol.length + colIndex}
                onClick={() => {
                  handleTurn(colIndex);
                }}
                className={`row w-full grid grid-rows-${gameCol.length} gap-4 grid-flow-col`}
              >
                {gameCol.map((rowVal, rowIndex) => {
                  return (
                    <button
                      disabled={!!winner}
                      key={gameCol.length + rowIndex}
                      type="button"
                      onClick={() => {
                        handleTurn(colIndex);
                      }}
                      className={classNames(
                        `row rounded-full w-30 h-30 flex flex-col justify-center items-center`,
                        {
                          "bg-neutral-100": winner,
                          "bg-white": rowVal === null && !winner,
                          "bg-red-400": rowVal === PLAYER.RED,
                          "bg-yellow-400": rowVal === PLAYER.YELLOW,
                        },
                      )}
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

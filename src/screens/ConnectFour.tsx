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

const beforeVals = (val: number) => {
  return Array.from({ length: val }, (_, i) => i);
};

// lists every index that comes after the one you give it,
// up to and including the last index on the board
// maxIndex is needed because the grid is not perfect square therefore not same max
const afterVals = (val: number, maxIndex: number) => {
  // maxIndex - val = how many digits to get
  // + 1 = starts on the next index valu and not on the current val
  return Array.from({ length: maxIndex - val }, (_, i) => val + 1 + i);
};

const evalDiag = ({
  gameState,
  latest,
  direction,
}: {
  gameState: (PlayerType | null)[][];
  latest: {
    player: PlayerType;
    colIndex: number;
    rowIndex: number;
  };
  direction: "desc" | "asc";
}): boolean => {
  const startRow =
    direction === "asc" ? MAX.ROW - 1 - latest.rowIndex : latest.rowIndex;

  const beforeRow = beforeVals(startRow);
  const afterRow = afterVals(startRow, MAX.ROW - 1);
  const beforeCol = beforeVals(latest.colIndex);
  const afterCol = afterVals(latest.colIndex, MAX.COL - 1);
  const beforeCount = Math.min(beforeRow.length, beforeCol.length);
  const afterCount = Math.min(afterRow.length, afterCol.length);

  const allRows = [
    ...beforeRow.slice(beforeRow.length - beforeCount),
    startRow,
    ...afterRow.slice(0, afterCount),
  ];
  const allCols = [
    ...beforeCol.slice(beforeCol.length - beforeCount),
    latest.colIndex,
    ...afterCol.slice(0, afterCount),
  ];

  const coords = allRows.map((row, idx) => {
    return {
      // flip back to the real array row before reading the board
      rowIndex: direction === "asc" ? MAX.ROW - 1 - row : row,
      colIndex: allCols[idx],
    };
  });
  return coords
    .map((item) => {
      return gameState[item.colIndex][item.rowIndex] ?? "-";
    })
    .join("")
    .includes(latest.player!.repeat(4));
};

const ConnectFour = () => {
  const [gameState, setGame] = useState<(PlayerType | null)[][]>(() => {
    return Array.from({ length: MAX.COL }, () => Array(MAX.ROW).fill(null));
  });
  const [turn, setTurn] = useState<boolean>(false); // false = red, true = yellow
  const [winner, setWinner] = useState<PlayerType | "draw">(null);
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
      .map((z) => z ?? "-")
      .join("")
      .includes(latest.player!.repeat(4));

    const rowWin = gameState
      .map((col) => col[latest.rowIndex] ?? "-")
      .join("")
      .includes(latest.player!.repeat(4));

    const descDiagWin = evalDiag({ gameState, latest, direction: "desc" });
    const ascDiagWin = evalDiag({ gameState, latest, direction: "asc" });

    if (colWin || rowWin || descDiagWin || ascDiagWin) {
      setWinner(latest.player);
    } else if (gameState.flat().every((val) => !!val)) {
      setWinner("draw");
    }
  };

  const reset = () => {
    setGame(Array.from({ length: MAX.COL }, () => Array(MAX.ROW).fill(null)));
    setTurn(false);
    setLatest(null);
    setWinner(null);
  };

  useEffect(() => {
    if (gameState.flat().every((val) => !val)) {
      setLatest(null);
      setWinner(null);
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
          {winner && winner === "draw" && <p>A draw! No winners </p>}
          {winner && winner !== "draw" && <p>{winner} has won!</p>}
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
                    <div
                      key={gameCol.length + rowIndex}
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
                    </div>
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

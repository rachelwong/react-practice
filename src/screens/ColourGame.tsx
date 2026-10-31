import ScreenLayout from "@/components/ScreenLayout";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";

const BASE_COLOURS = {
  red: "hsl(0, 72%, 51%)",
  orange: `hsl(25, 95%, 53%)`,
  yellow: "hsl(50, 98%, 64%)",
  lime: "hsl(83, 78%, 55%)",
  emerald: "hsl(161, 94%, 30%)",
  blue: "hsl(221, 83%, 53%)",
  violet: `hsl(272, 72%, 47%)`,
  pink: "hsl(330, 81%, 60%)",
  rose: "hsl(347, 77%, 50%)",
  grey: "hsl(215, 14%, 34%)",
  stone: "hsl(30, 6%, 25%)",
};

const MAX_GRID_LEN = 8;
const MAX_LEVEL = 50;

type Coords = { x: number; y: number };
const grid: Coords[][] = Array.from({ length: MAX_GRID_LEN }, () =>
  Array(MAX_GRID_LEN).fill(null),
);

const getRandomNumber = (): number => {
  const minCeiled = Math.ceil(0);
  const maxFloored = Math.floor(MAX_GRID_LEN - 1);
  const random =
    Math.floor(Math.random() * (maxFloored - minCeiled + 1)) + minCeiled;
  return random;
};

const ColourGame = () => {
  const [level, setLevel] = useState<number>(1); // max 50
  const [target, setTarget] = useState<Coords | null>(null);
  const [selected, setSelected] = useState<Coords | null>(null);

  const getRandomTarget = () => {
    setTarget({ x: getRandomNumber(), y: getRandomNumber() });
  };

  const nextGame = () => {
    if (level === MAX_LEVEL) {
      return;
    }
    setLevel((prev) => prev + 1);
    getRandomTarget();
    setSelected(null);
  };

  const reset = () => {
    setSelected(null);
    setLevel(1);
    getRandomTarget();
  };

  useEffect(() => {
    getRandomTarget();
  }, []);

  const hasWon =
    level === 50 &&
    target &&
    selected &&
    target.x === selected.x &&
    target.y === selected.y;

  const hasLost =
    target && selected && (target.x !== selected.x || target.y !== selected.y);

  const onSelect = (val: Coords): void => {
    setSelected(val);
    if (val?.x === target?.x && val?.y === target?.y) {
      if (level < 50) {
        nextGame();
        return;
      }
    }
  };

  return (
    <ScreenLayout
      brief="https://www.reactchallenges.com/challenges/color-game"
      title="Colour game"
    >
      <div className="flex flex-col items-center mx-auto justify-center max-w-2xl w-full gap-y-4">
        <h1 className="text-3xl font-extrabold">
          {hasWon && "You've won!"}
          {hasLost && "Game over!"}
        </h1>
        <h3 className="text-lg font-bold">
          Level: {level} | selected {JSON.stringify(selected)} | target{" "}
          {JSON.stringify(target)}
        </h3>
        <div className="flex flex-col items-center justify-center w-full h-full gap-y-6 mb-10">
          <div
            className={`w-full grid grid-rows-${MAX_GRID_LEN} grid-flow-col gap-2`}
          >
            {grid.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className={`grid grid-cols-${MAX_GRID_LEN} gap-2`}
              >
                {row.map((_, colIndex) => {
                  const highlight = hasLost
                    ? target?.x === rowIndex && target?.y === colIndex
                    : false;
                  return (
                    <button
                      type="button"
                      onClick={() => {
                        onSelect({ x: rowIndex, y: colIndex });
                      }}
                      key={`${rowIndex} ${colIndex}`}
                      className={`bg-pink-200 aspect-square rounded-xl text-sm hover:cursor-pointer rounded flex flex-row items-center justify-center border-2 ${highlight ? "border-black" : "border-white"}`}
                    >
                      ({rowIndex}, {colIndex})
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          <Button
            size="lg"
            onClick={() => {
              reset();
            }}
          >
            <RefreshCcw />
            Reset game
          </Button>
        </div>
      </div>
    </ScreenLayout>
  );
};

export default ColourGame;

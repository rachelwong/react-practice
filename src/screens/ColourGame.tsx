import ScreenLayout from "@/components/ScreenLayout";
import { Button } from "@/components/ui/button";
import { fullRandomShuffleArray, validHSLColour } from "@/utils";
import { decode } from "html-entities";
import { RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";

const BASE_COLOURS: Record<string, string> = {
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
} as const;

const MAX_GRID_LEN = 8;
const MAX_LEVEL = 5;

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

const getTargetColour = (
  baseColour: string,
  level: number,
): string | undefined => {
  const hslColourValues = baseColour.match(validHSLColour);
  if (!hslColourValues) {
    return undefined;
  }

  const hue = Number(hslColourValues[1]);
  const saturation = Number(hslColourValues[2]);
  const lightness = Number(hslColourValues[3]);

  // Since the number you're dividing by doubles each level, the result halves each level
  // how many percentage points the target square's lightness moves away from the base colour
  // 2 sets how quickly it gets harder. increase that val makes it harder faster
  const offset = 100 / Math.pow(2, level);
  const newLightness = lightness > 50 ? lightness - offset : offset + lightness;
  return `hsl(${hue}, ${saturation}%, ${newLightness}%)`;
};

const ColourGame = () => {
  // before adding a useState, ask "could I work this out from what I already have?"
  // If yes, make it a plain variable
  const [level, setLevel] = useState<number>(1);
  const [target, setTarget] = useState<Coords | null>(null);
  const [selected, setSelected] = useState<Coords | null>(null);
  const [baseColour, setBaseColour] = useState<string>();

  const targetColour = baseColour
    ? getTargetColour(baseColour, level)
    : undefined;

  const randomiseBoard = () => {
    setTarget({ x: getRandomNumber(), y: getRandomNumber() });

    let randomBaseColours: string[] = fullRandomShuffleArray({
      items: Object.values(BASE_COLOURS).filter((x) => x !== baseColour),
    });

    setBaseColour(randomBaseColours[0]);
  };

  const nextGame = () => {
    setLevel((prev) => prev + 1);
    randomiseBoard();
    setSelected(null);
  };

  const reset = () => {
    setSelected(null);
    setLevel(1);
    randomiseBoard();
  };

  useEffect(() => {
    randomiseBoard();
  }, []);

  const hasWon =
    level === MAX_LEVEL &&
    target &&
    selected &&
    target.x === selected.x &&
    target.y === selected.y;

  const hasLost =
    target && selected && (target.x !== selected.x || target.y !== selected.y);

  const onSelect = (val: Coords): void => {
    if (hasLost || hasWon) {
      return;
    }
    setSelected(val);
    if (val?.x === target?.x && val?.y === target?.y && level < MAX_LEVEL) {
      nextGame();
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
        <h3 className="text-lg font-bold">Level: {level}</h3>
        <div className="flex flex-col items-center justify-center w-full h-full gap-y-6 mb-10">
          <div
            className={`w-full grid grid-flow-col gap-2`}
            style={{
              gridTemplateRows: `repeat(${MAX_GRID_LEN}, minmax(0, 1fr))`,
            }}
          >
            {grid.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className={`grid gap-2`}
                style={{
                  gridTemplateColumns: `repeat(${MAX_GRID_LEN}, minmax(0, 1fr))`,
                }}
              >
                {row.map((_, colIndex) => {
                  const isTarget =
                    target?.x === rowIndex && target?.y === colIndex;
                  return (
                    <button
                      disabled={!!hasWon}
                      type="button"
                      onClick={() => {
                        onSelect({ x: rowIndex, y: colIndex });
                      }}
                      key={`${rowIndex} ${colIndex}`}
                      className={`aspect-square rounded-xl text-sm hover:cursor-pointer rounded flex flex-row items-center justify-center border-2 ${hasLost && isTarget ? "border-black" : "border-white"}`}
                      style={{
                        backgroundColor: isTarget
                          ? `${targetColour}`
                          : `${baseColour}`,
                      }}
                    >
                      {hasWon
                        ? decode(`&#127942;`)
                        : hasLost
                          ? decode(`&#128170;`)
                          : `${rowIndex}, ${colIndex}`}
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

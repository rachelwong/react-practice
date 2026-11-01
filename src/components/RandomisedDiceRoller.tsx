import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Spinner } from "./ui/spinner";

const DICE_AMOUNTS = "abcdef".toUpperCase().split("");
const FRICTION = 1.1; // increase wait time by 10%; How fast it slows down
const STOP_AT = 800; // in ms // The point where it feels "heavy" and stops
const CURR_DELAY = 50; // in ms Starting speed (very fast)

function getRandomIntInclusive() {
  const minCeiled = Math.ceil(0);
  const maxFloored = Math.floor(DICE_AMOUNTS.length - 1);
  // The maximum is inclusive and the minimum is inclusive
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1)) + minCeiled;
}

const RandomisedDiceRoller = () => {
  const [targetIndex, setTargetIndex] = useState<number>(() => {
    return getRandomIntInclusive();
  });
  const [loading, setLoading] = useState<boolean | null>(null);
  const [selectedIndex, setIndex] = useState<number>(0);

  // time between each tick which is essentially between each step it goes through
  // the list
  const delayRef = useRef<number | null>(CURR_DELAY);

  const roll = () => {
    delayRef.current = CURR_DELAY;
    setTargetIndex(getRandomIntInclusive());
    setLoading(true);
  };

  useEffect(() => {
    if (!delayRef?.current || !loading) {
      return;
    }

    // stop cycling when it has reached the target AND has gone past the threshold
    if (delayRef.current > STOP_AT && selectedIndex === targetIndex) {
      setLoading(false);
      return;
    }

    // increase the wait time before updating the index
    delayRef.current *= FRICTION;

    // wait to increment the index
    // which in terms triggers the useEffect again as the selectedIndex has changed
    const ticker = setTimeout(() => {
      if (selectedIndex === DICE_AMOUNTS.length - 1) {
        setIndex(0);
      } else {
        setIndex((prev) => prev + 1);
      }
    }, delayRef.current);

    return () => clearTimeout(ticker);
  }, [loading, selectedIndex, targetIndex]);

  return (
    <div className="p-6 w-full h-auto flex flex-col items-center justify-start bg-taupe-100 gap-y-6">
      <p className="font-bold">
        Variable cycling speed with pre-calculated randomised result{" "}
        {JSON.stringify(delayRef.current)}
      </p>
      <Button size="lg" disabled={loading === true} onClick={() => roll()}>
        {loading ? <Spinner /> : "Roll dice"}
      </Button>
      <div className="flex flex-row justify-center items-center gap-x-4">
        {DICE_AMOUNTS.map((val, valIndex) => (
          <Card
            key={val}
            className={`p-6 border-3 ${valIndex === selectedIndex ? "border-green-500" : "border-white"}`}
          >
            {val}
          </Card>
        ))}
      </div>
      {loading === false && (
        <p className="text-center">
          Selected value: {JSON.stringify(DICE_AMOUNTS[selectedIndex])}
        </p>
      )}
    </div>
  );
};

export default RandomisedDiceRoller;

import ScreenLayout from "@/components/ScreenLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pause, Play, TimerReset } from "lucide-react";
import { useEffect, useState } from "react";

const DICE_AMOUNTS = Array.from(Array(6).keys()).map((x) => x + 1);

const DiceRoller = () => {
  const [selectedIndex, setIndex] = useState<number | null>(null);
  // const [milliseconds, setMilliseconds] = useState<number>(60000);
  const [status, setStatus] = useState<boolean>(false);

  const handleReset = () => {
    setIndex(null);
    setStatus(false);
  };

  useEffect(() => {
    if (!status) {
      return;
    }

    if (selectedIndex === null) {
      setIndex(0);
    }

    const timer = setInterval(() => {
      if (selectedIndex === DICE_AMOUNTS.length - 1) {
        setIndex(0);
      } else {
        setIndex((prev) => (prev === null ? null : prev + 1));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [status, selectedIndex]);

  return (
    <ScreenLayout
      title={"Dice Roller"}
      description={<p>Attempting randomised value selector for Wordage quiz</p>}
    >
      <div className="flex flex-col gap-y-6">
        <div className="flex flex-row justify-center items-center gap-x-10">
          <Button
            className="w-30 h-10"
            size="lg"
            onClick={() => setStatus((prev) => !prev)}
          >
            {!status ? <Play /> : <Pause />}
            {!status ? "Start" : "Stop"}
          </Button>
          <Button
            className="w-30 h-10"
            size="lg"
            variant="secondary"
            onClick={() => handleReset()}
          >
            <TimerReset />
            Reset timer
          </Button>
        </div>
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
        {selectedIndex !== null && status !== null && (
          <p className="text-center">
            Selected value: {JSON.stringify(DICE_AMOUNTS[selectedIndex])}
          </p>
        )}
      </div>
    </ScreenLayout>
  );
};

export default DiceRoller;

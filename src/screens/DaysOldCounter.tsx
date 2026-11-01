import ScreenLayout from "@/components/ScreenLayout";
import { Card } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";

function getDaysBetween(fromDate: Date) {
  const now = new Date();

  const todayUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const diffInMs = todayUtc - fromDate.getTime();
  return Math.round(diffInMs / (1000 * 60 * 60 * 24));
}

const TICK_MS = 20; // wait time between each number change
const TOTAL_DURATION = 1000;

const DaysOldCounter = () => {
  const [dob, setDob] = useState<string>("");

  // ref captures the whole element rather than just the count
  const displayCount = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    let countElement = displayCount?.current;
    if (!countElement) {
      return;
    }

    // set default display before calculating dates
    countElement.textContent = "0";

    const parsed: Date | null = new Date(dob);
    if (!parsed || isNaN(parsed.getTime())) {
      return;
    }
    let days: number = getDaysBetween(parsed);
    if (days < 0) {
      return;
    }

    // how many times number changes (50 times)
    const numUpdates = TOTAL_DURATION / TICK_MS;

    // how much to increment the current count by
    // until it reaches the target (days)
    // rounded up to allow finishing on time
    // might tick extra
    const stepSize = Math.ceil(days / numUpdates);

    // number the count has reached so far
    let current: number = 0;

    const ticker = setInterval(() => {
      current += stepSize;

      if (current >= days) {
        // final display is the days itself and not the divided current
        // which is a working display
        countElement.textContent = days.toString();
      } else {
        countElement.textContent = current.toString();
      }
    }, TICK_MS);

    return () => clearInterval(ticker);
  }, [dob]);

  return (
    <ScreenLayout
      brief="https://www.reactchallenges.com/challenges/days-old-counter"
      title="Days old counter"
    >
      <Card className="flex flex-col mx-auto max-w-4xl w-full h-auto gap-y-6">
        <h1 className="text-2xl font-extrabold text-slate-700 text-center">
          How many days old are you?
        </h1>
        <div className="field flex flex-col w-full items-center justify-center gap-y-4">
          <label htmlFor="dob-field">Date of birth</label>
          <input
            id="dob-field"
            type="date"
            value={dob}
            placeholder="dd/mm/yyyy"
            className="px-4 py-3 rounded rounded-lg border-1 border-neutral-600"
            onChange={(e) => {
              setDob(e.target.value);
            }}
          />
        </div>
        <div className="display flex flex-col justify-center items-center text-center">
          <h2 ref={displayCount} className="text-8xl font-extrabold">
            0
          </h2>
          <p className="text-lg font-bold">days old</p>
        </div>
      </Card>
    </ScreenLayout>
  );
};

export default DaysOldCounter;

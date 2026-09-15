import {
  useRacesContext,
  type RaceSummaryProfile,
} from "@/context/RacesContext";
import { differenceInMilliseconds, format, fromUnixTime } from "date-fns";
import { memo, useEffect } from "react";

const RaceItem = memo(
  ({ summary, index }: { summary: RaceSummaryProfile; index: number }) => {
    const start = fromUnixTime(summary.advertised_start.seconds);
    const { removeRace } = useRacesContext();

    useEffect(() => {
      const delay = differenceInMilliseconds(
        fromUnixTime(summary.remove_at_unix),
        new Date(),
      );

      const timer = setTimeout(() => {
        removeRace(summary.race_id);
      }, delay);
      return () => {
        clearTimeout(timer);
      };
    }, [summary.remove_at_unix, summary.advertised_start.seconds]);

    return (
      <li
        key={summary.race_id}
        className="py-3 px-6 flex flex-row justify-between align-center bg-neutral-100"
      >
        <div className="flex flex-row align-center justify-start w-2/3">
          <span className="w-1/3">
            # {summary.race_number} / {index}
          </span>
          <span className="w-2/3">{summary.race_name}</span>
        </div>
        <div className="w-1/3 flex flex-row align-center justify-end">
          <span>Start: {format(start, "d MMM yyyy, h:mm:ss a")}</span>
        </div>
      </li>
    );
  },
);

export default RaceItem;

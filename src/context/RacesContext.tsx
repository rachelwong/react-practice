import getRaces from "@/services/getRaces";
import type { RaceSummary } from "@/services/types/NedsRaceResponse";
import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
} from "react";
export type RaceSummaryProfile = RaceSummary & { remove_at_unix: number };

export const FILTER = {
  GREYHOUND: "9daef0d7-bf3c-4f50-921d-8e818c60fe61",
  HARNESS: "161d9be2-e909-4326-8c2c-35ed71fb460b",
  HORSE: "4a2788f8-e825-4d36-9894-efd4baf1cfae",
};

export interface RaceContextValue {
  races: RaceSummaryProfile[];
  filter: (typeof FILTER)[keyof typeof FILTER] | null;
  loading: boolean;
  getData: (number?: number) => void;
  setFilter: Dispatch<React.SetStateAction<string | null>>;
  removeRace: (id: string) => void;
}

const initialValue = {} as RaceContextValue;

const RacesContext = createContext<RaceContextValue>(initialValue);

const RacesContextProvider = ({ children }: { children: ReactNode }) => {
  const [races, setRaces] = useState<RaceSummaryProfile[]>([]);
  const [filter, setFilter] = useState<
    (typeof FILTER)[keyof typeof FILTER] | null
  >(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getData = async (number?: number) => {
    try {
      setLoading(true);

      const response = await getRaces({ count: number });
      const raceSummaries = response?.next_to_go_ids.map((x) => {
        return {
          remove_at_unix:
            response.race_summaries[x].advertised_start.seconds + 60,
          ...response.race_summaries[x],
        };
      });
      if (number !== undefined && number < 10) {
        setRaces((prev) => {
          let existing = [...new Set(prev.map((x) => x.race_id))];
          let newData = (raceSummaries ?? []).filter(
            (x) => !existing.includes(x.race_id),
          );
          return [...prev, ...newData];
        });
      } else {
        // set all
        setRaces(raceSummaries ?? []);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const removeRace = (id: string) => {
    setRaces((prev) => prev.filter((x) => x.race_id !== id));
    getData(1);
  };

  const state = {
    races,
    filter,
    loading,
    getData,
    setFilter,
    removeRace,
  };

  return (
    <RacesContext.Provider value={state}>{children}</RacesContext.Provider>
  );
};

export default RacesContextProvider;

export function useRacesContext() {
  const context = useContext(RacesContext);
  if (!context) {
    throw new Error(`useRacesContext must be used with RacesProvider`);
  }
  return context;
}

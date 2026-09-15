import Layout from "@/components/Layout";
import RaceItem from "@/components/RaceItem";
import { Button } from "@/components/ui/button";
import { FILTER, useRacesContext } from "@/context/RacesContext";
import classNames from "classnames";
import { useEffect, useMemo } from "react";

const Races = () => {
  const { races, getData, setFilter, filter } = useRacesContext();

  useEffect(() => {
    getData(10);
  }, []);

  const resetFilter = () => {
    setFilter(null);
  };

  const applyFilter = (id: (typeof FILTER)[keyof typeof FILTER]): void => {
    setFilter(id);
  };

  const orderedRaces = useMemo(() => {
    return [...races]
      .sort((a, b) => a.advertised_start.seconds - b.advertised_start.seconds)
      .filter((x) => (filter ? x.category_id === filter : x))
      .slice(0, 5);
  }, [races, filter]);

  return (
    <Layout
      heading={
        <>
          <h3>Rolling race timetable</h3>
          <p>
            Original brief{" "}
            <a href="/Entain_Technical_Task_-__Front-End_Developer__Vue_..pdf">
              here
            </a>
          </p>
          <p className="text-red-600">
            CORS policy behind the NEDS api so only runs locally
          </p>
        </>
      }
    >
      <div className="races-table relative block w-full h-full">
        <div className="flex flex-col h-full relative w-4/5 mx-auto ">
          <h3 className="text-2xl font-extrabold">Race Filters</h3>
          <div className="flex flex-row align-center justify-start gap-x-3 my-4">
            <Button size="lg" variant="default" onClick={() => resetFilter()}>
              All
            </Button>
            <Button
              size="lg"
              variant={filter === FILTER.GREYHOUND ? "default" : "outline"}
              className={classNames("", {
                "bg-green-200": filter === FILTER.GREYHOUND,
              })}
              onClick={() => applyFilter(FILTER.GREYHOUND)}
            >
              Greyhound
            </Button>
            <Button
              size="lg"
              className={classNames("", {
                "bg-green-200": filter === FILTER.HORSE,
              })}
              variant={filter === FILTER.HORSE ? "default" : "outline"}
              onClick={() => applyFilter(FILTER.HORSE)}
            >
              Horse
            </Button>{" "}
            <Button
              size="lg"
              className={classNames("", {
                "bg-green-200": filter === FILTER.HARNESS,
              })}
              variant={filter === FILTER.HARNESS ? "default" : "outline"}
              onClick={() => applyFilter(FILTER.HARNESS)}
            >
              Harness
            </Button>{" "}
          </div>

          <ul className="flex flex-col align-start justify-start gap-y-3">
            {orderedRaces.map((summary, index) => {
              return (
                <RaceItem
                  key={summary.race_id}
                  summary={summary}
                  index={index}
                />
              );
            })}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Races;

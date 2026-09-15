import Layout from "@/components/Layout";
import getRaces from "@/services/getRaces";
import type { RaceSummary } from "@/services/types/NedsRaceResponse";
import { format, fromUnixTime } from "date-fns";
import { useEffect, useState } from "react";

const Races = () => {
  const [data, setData] = useState<RaceSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getData = async () => {
    try {
      setLoading(true);

      const response = await getRaces({});
      const raceSummaries = response?.next_to_go_ids.map(
        (x) => response.race_summaries[x],
      );
      setData(raceSummaries ?? []);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

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
        </>
      }
    >
      <div className="races-table relative block w-full h-full">
        {loading && <p>loading ... </p>}
        {!loading && (
          <ul className="w-4/5 mx-auto flex flex-col align-start justify-start gap-y-3">
            {data.map((summary, index) => {
              const start = fromUnixTime(summary.advertised_start.seconds);
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
                    <span>Start: {format(start, "d MMM yyyy, h:mm a")}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default Races;

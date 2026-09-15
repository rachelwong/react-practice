import axios from "axios";
import type { NedsRaceResponse } from "./types/NedsRaceResponse";

const getRaces = async ({
  count = 10,
}: {
  count?: number;
}): Promise<NedsRaceResponse | undefined> => {
  const baseURL = `/neds-api/rest/v1/racing/?method=nextraces&count=${count}`;
  try {
    const { data } = await axios.get(baseURL);
    if (data.status !== 200) {
      console.error(
        `Error getting successful race data from NEDS api. Raw response ${data}`,
      );
      return;
    }
    return data.data;
  } catch (err) {
    console.error(
      `Error getting races from NEDS api with count: ${count} and error ${err}`,
    );
    throw err;
  }
};

export default getRaces;

import axios from "axios";
import type { WikiSearchResponse } from "./types/WikiSearchResponse";

const getWikiSearch = async (query: string): Promise<WikiSearchResponse> => {
  const parsed = encodeURIComponent(query);

  const baseURl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${parsed}&format=json&origin=*`;
  try {
    const { data } = await axios.get(baseURl);

    return {
      titles: data[1],
      urls: data[3],
    };
  } catch (err) {
    console.error(`Error using Wikipedia OpenSearch API service ${err}`);
    throw new Error(`Error using Wikipedia OpenSearch API`, { cause: err });
  }
};

export default getWikiSearch;

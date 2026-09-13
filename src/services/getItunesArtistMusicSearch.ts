import axios from "axios";
import type { ItunesArtistSearchResponse } from "./types/ItunesMusicSearchResponse";

const getItunesArtistSearch = async ({
  artist,
}: {
  artist: string;
}): Promise<ItunesArtistSearchResponse | null> => {
  try {
    const param = encodeURIComponent(artist.trim().replace(/ /g, "+"));
    const baseUrl = `https://itunes.apple.com/search?&entity=musicTrack&term=${param}`;

    const { data } = await axios.get(baseUrl);
    return data;
  } catch (err) {
    console.error(`GET itunes artist search error ${err}`);
    // TODO throw custom error here
    throw err;
  }
};

export default getItunesArtistSearch;

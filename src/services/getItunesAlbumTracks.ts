import axios from "axios";
import type { ItunesAlbumSearchResponse } from "./types/ItunesMusicSearchResponse";

const getItunesAlbumTracks = async ({
  id,
}: {
  id: string;
}): Promise<ItunesAlbumSearchResponse | null> => {
  try {
    const baseURL = `https://itunes.apple.com/lookup?id=${id}&entity=song`;

    const { data } = await axios.get(baseURL);
    return data;
  } catch (err) {
    console.error(
      `Get Itunes Album Tracks by Id error for id ${id} error: ${err}`,
    );
    throw err;
  }
};

export default getItunesAlbumTracks;

import axios from "axios";
import type { Album } from "./types/AlbumResponse";

const getAlbums = async (number?: string): Promise<Album[] | undefined> => {
  const baseURL = `https://jsonplaceholder.typicode.com/albums${!!number ? `/${number}` : ""}`;
  try {
    const { data } = await axios.get(baseURL, {});

    return [...data];
  } catch (err) {
    console.error(`Error getting ${number} albums ${err}`);
    throw err;
  }
};

export default getAlbums;

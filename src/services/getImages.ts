import axios from "axios";
import type { ImageResponse } from "./types/ImageResponse";

const getImages = async (): Promise<ImageResponse | undefined> => {
  const baseURL = `https://picsum.photos/v2/list?page=2&limit=100`;
  try {
    const { data } = await axios.get(baseURL);
    return data;
  } catch (err) {
    throw new Error(`Unable to get picsum images with error: ${err}`);
  }
};

export default getImages;

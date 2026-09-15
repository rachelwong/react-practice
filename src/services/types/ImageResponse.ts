export interface ImageProfile {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

export type ImageResponse = ImageProfile[];

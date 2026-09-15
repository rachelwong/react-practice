export interface ImageState {
  byBreed: Record<
    string,
    { imageUrls: string[]; status: "idle" | "loading" | "error" }
  >;
}

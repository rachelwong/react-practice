export interface TrackResult {
  wrapperType: "track" | "collection" | "artistFor";
  kind: string;
  artistId: number;
  collectionId: number;
  trackId: number;
  artistName: string;
  collectionName: string;
  trackName: string;
  collectionCensoredName: string;
  trackCensoredName: string;
  artistViewUrl: string;
  collectionViewUrl: string;
  trackViewUrl: string;
  previewUrl: string;
  artworkUrl30: string;
  artworkUrl60: string;
  artworkUrl100: string;
  collectionPrice: number;
  trackPrice: number;
  releaseDate: string;
  collectionExplicitness: string;
  trackExplicitness: string;
  discCount: number;
  discNumber: number;
  trackCount: number;
  trackNumber: number;
  trackTimeMillis: number;
  country: string;
  currency: string;
  primaryGenreName: string;
  isStreamable: boolean;
}

export interface ItunesArtistSearchResponse {
  resultCount: number;
  results: TrackResult[];
}
export interface ItunesAlbumSearchResponse {
  resultCount: number;
  results: (AlbumResult | TrackResult)[];
}
export interface AlbumResult {
  wrapperType: "track" | "collection" | "artistFor";
  collectionType: string;
  artistId: number;
  collectionId: number;
  amgArtistId: number;
  artistName: string;
  collectionName: string;
  collectionCensoredName: string;
  artistViewUrl: string;
  collectionViewUrl: string;
  artworkUrl60: string;
  artworkUrl100: string;
  collectionPrice: number;
  collectionExplicitness: string;
  trackCount: number;
  copyright: string;
  country: string;
  currency: string;
  releaseDate: string;
  primaryGenreName: string;
}

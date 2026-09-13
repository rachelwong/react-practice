import getItunesAlbumTracks from "@/services/getItunesAlbumTracks";
import getItunesArtistSearch from "@/services/getItunesArtistMusicSearch";
import {
  type AlbumResult,
  type TrackResult,
} from "@/services/types/ItunesMusicSearchResponse";
import {
  createContext,
  useContext,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";

const initialValue = {} as MusicPlayerContextType;

export interface MusicPlayerContextType {
  search: string;
  searchResults: TrackResult[];
  loadingSearch: boolean;
  error: string | null;
  activeTrack: TrackResult | null;
  onChangeSearch: (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => void;
  onSearchArtist: () => void;
  onSelectTrack: (track: TrackResult) => void;
  activeAlbum: (AlbumResult | TrackResult)[];
}

const MusicPlayerContext = createContext<MusicPlayerContextType>(initialValue);

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState<string>("");
  const [searchResults, setSearchResults] = useState<TrackResult[]>([]);
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTrack, setActiveTrack] = useState<TrackResult | null>(null);
  const [activeAlbum, setActiveAlbum] = useState<(AlbumResult | TrackResult)[]>(
    [],
  );

  const isSubmitting = useRef<boolean>(false);

  const onChangeSearch = (
    e: ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    setSearch(e.target.value);
  };

  const getAlbumByTrack = async (id: string) => {
    setError(null);

    if (!id || !activeTrack || !activeTrack?.collectionId) {
      setError(`No active track selected with valid id to get album details`);
      return;
    }

    try {
      setLoadingSearch(true);

      const data = await getItunesAlbumTracks({
        id,
      });
      if (!data || !data?.resultCount) {
        setError(
          `Unable to get album details from active track album id: ${activeTrack?.collectionId} or collection Id ${id}`,
        );
        return;
      }
      setActiveAlbum(data.results);
    } catch (err) {
      setError(
        `Unable to get album by track with with active track Id: ${activeTrack?.trackId} or collection id ${id} and album id ${activeTrack?.collectionId}`,
      );
      throw err;
    } finally {
      setLoadingSearch(false);
    }
  };

  const onSelectTrack = (track: TrackResult) => {
    setError(null);
    if (!track.previewUrl) {
      setError(
        `Unable to play song ${track.trackName} by ${track.artistName} - id: ${track.trackId}`,
      );
      return;
    }
    setActiveTrack(track);

    getAlbumByTrack(track.collectionId.toString());
  };

  const onSearchArtist = async () => {
    if (isSubmitting.current) {
      return;
    }

    try {
      isSubmitting.current = true;
      setLoadingSearch(true);

      const response = await getItunesArtistSearch({ artist: search });

      setSearchResults(response?.results ?? []);
    } catch (err) {
      setError(
        `Error fetching artist with search term: ${search}. Error: ${err}`,
      );
      throw err;
    } finally {
      setSearch("");
      setLoadingSearch(false);
      isSubmitting.current = false;
    }
  };

  const state = {
    search,
    searchResults,
    loadingSearch,
    activeTrack,
    error,
    activeAlbum,
    onChangeSearch,
    onSearchArtist,
    onSelectTrack,
  };

  return (
    <MusicPlayerContext.Provider value={state}>
      {children}
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayerContext() {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error("useMusicPlayerContext must be used inside a provider");
  }
  return context;
}

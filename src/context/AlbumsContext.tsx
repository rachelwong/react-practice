// get albums

import getAlbums from "@/services/getAlbums";
import type { Album } from "@/services/types/AlbumResponse";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

// divide albums by dynamic page size and store by page
// serve 1st page on load
// every page get await 500ms
// 33.333% of page get resolve to 500 error (randomised every 1 in 3 attempt will fail)

export interface AlbumsContextType {
  albumData: Album[];
  loading: boolean;
}

const initialState = {
  albumData: [],
  loading: false,
};

const AlbumContext = createContext<AlbumsContextType>(initialState);

async function fakeFetchPage() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (Math.random() < 1 / 3) {
    throw new Error("500 Internal Server Error");
  }
}

const AlbumsProvider = ({ children }: PropsWithChildren) => {
  const [albumData, setAlbumData] = useState<Album[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const state = {
    albumData,
    loading,
  };

  const getData = async () => {
    try {
      setLoading(true);
      const response = await getAlbums();
      setAlbumData(response as Album[]);
    } catch (err) {
      console.error(`error getting album data in context ${err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return <AlbumContext value={state}>{children}</AlbumContext>;
};

export default AlbumsProvider;

export interface UseAlbumsType {
  currPageData: Album[];
  totalNumPages: number;
  currIndex: number;
  nextPage: () => void;
  prevPage: () => void;
  endPage: () => void;
  startPage: () => void;
  goToPage: (target: number) => void;
  loadingPage: boolean;
  errorPage: boolean;
  headers: string[];
}

export function useAlbums(pageSize: number = 10): UseAlbumsType {
  const context = useContext(AlbumContext);
  // return slices
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  const [currIndex, setCurrIndex] = useState<number>(0);
  const [loadingPage, setLoadingPage] = useState<boolean>(false);
  const [errorPage, setErrorPage] = useState<boolean>(false);
  const { albumData } = context;
  const totalNumPages = Math.ceil(albumData.length / pageSize);

  const nextPage = () => {
    if (currIndex + 1 >= totalNumPages) {
      return;
    }
    goToPage(currIndex + 1);
  };

  const endPage = () => {
    goToPage(totalNumPages);
  };

  const startPage = () => {
    goToPage(0);
  };

  const goToPage = (targetIndex: number): void => {
    try {
      setErrorPage(false);
      setLoadingPage(true);
      fakeFetchPage();
      setCurrIndex(targetIndex);
    } catch (err) {
      setErrorPage(true);
    } finally {
      setLoadingPage(false);
    }
  };

  const prevPage = () => {
    if (currIndex === 0) {
      return;
    }
    goToPage(currIndex - 1);
  };

  const currPageData = useMemo(() => {
    const { albumData } = context;
    if (!albumData || !albumData.length) {
      return [];
    }
    const result = [];
    for (let i = 0; i < albumData.length; i += pageSize) {
      const chunk = albumData.slice(i, i + pageSize);
      result.push(chunk);
    }
    return result.length ? result[currIndex] : [];
  }, [albumData, currIndex, totalNumPages, pageSize]);

  const headers = albumData.length ? [...Object.keys(albumData[0])] : [];

  return {
    currPageData,
    totalNumPages,
    currIndex,
    nextPage,
    prevPage,
    endPage,
    startPage,
    goToPage,
    loadingPage,
    errorPage,
    headers,
  };
}

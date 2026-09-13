import { useMusicPlayerContext } from "@/context/MusicPlayerContext";
import classNames from "classnames";
import MusicResultItem from "./MusicResultItem";
import { Alert, AlertTitle } from "./ui/alert";

const MusicSearchList = ({ className }: { className?: string }) => {
  const { search, searchResults } = useMusicPlayerContext();
  return (
    <div
      className={classNames(
        "overflow-y-auto flex flex-col align-start w-1/2 h-full z-10",
        className,
      )}
    >
      {!searchResults.length && !!search && (
        <Alert>
          <AlertTitle>No results for {search}</AlertTitle>
        </Alert>
      )}
      {!!searchResults.length &&
        searchResults.map((result) => {
          return <MusicResultItem key={result.trackId} track={result} />;
        })}
    </div>
  );
};

export default MusicSearchList;

import { useMusicPlayerContext } from "@/context/MusicPlayerContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const MusicPlayerSearch = () => {
  const { onChangeSearch, onSearchArtist } = useMusicPlayerContext();

  return (
    <div className="bg-white player-search w-full block border-2 border-green-900">
      <div className="w-300 flex flex-row align-center justify-center p-5 gap-x-10 mx-auto">
        <Input placeholder="Search Artist" onChange={onChangeSearch} />
        <Button size="lg" className="" onClick={() => onSearchArtist()}>
          Search
        </Button>
      </div>
    </div>
  );
};

export default MusicPlayerSearch;

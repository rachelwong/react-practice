import { useMusicPlayerContext } from "@/context/MusicPlayerContext";
import { Pause, Play, StepBack, StepForward } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";

const MusicPlayerBar = () => {
  const { activeTrack } = useMusicPlayerContext();
  return (
    <div className="bg-sky-200 player-search w-full block py-10">
      <div className="w-300 flex flex-col align-center justify-center">
        <div className="w-full flex flex-row align-center justify-center play-bar__control gap-x-8">
          <Button variant="outline" size="icon" className="" onClick={() => {}}>
            <StepBack />
          </Button>
          <Button variant="outline" size="icon" className="" onClick={() => {}}>
            <Play />
          </Button>
          <Button variant="outline" size="icon" className="" onClick={() => {}}>
            <Pause />
          </Button>{" "}
          <Button variant="outline" size="icon" className="" onClick={() => {}}>
            <StepForward />
          </Button>
        </div>
        {!!activeTrack && (
          <audio controls>
            <source src={activeTrack.previewUrl} type="audio/mp4" />
            Your browser does not support the audio element.
          </audio>
        )}
        <Slider
          defaultValue={10}
          max={100}
          className="mx-auto w-full px-10 mt-6"
        />
      </div>
    </div>
  );
};

export default MusicPlayerBar;

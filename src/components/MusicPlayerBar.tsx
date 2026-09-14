import { StepBack, StepForward } from "lucide-react";
import MusicAudioControl from "./MusicAudioControl";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";

const MusicPlayerBar = () => {
  return (
    <div className="bg-sky-200 player-search w-full block py-10">
      <div className="w-300 flex flex-col align-center justify-center">
        <div className="w-full flex flex-row align-center justify-center play-bar__control gap-x-8">
          <Button variant="outline" size="icon" className="" onClick={() => {}}>
            <StepBack />
          </Button>
          <MusicAudioControl />
          <Button variant="outline" size="icon" className="" onClick={() => {}}>
            <StepForward />
          </Button>
        </div>
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

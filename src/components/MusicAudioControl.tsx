import { useMusicPlayerContext } from "@/context/MusicPlayerContext";
import classNames from "classnames";
import { Pause, Play } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "./ui/button";

const MusicAudioControl = ({ className }: { className?: string }) => {
  const { activeTrack, setIsAudioPlaying, isAudioPlaying } =
    useMusicPlayerContext();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const togglePlayAudio = () => {
    if (!audioRef?.current) {
      setError("Unable to play audio");
      return;
    }

    if (audioRef.current.paused) {
      audioRef.current.play().then(() => {
        setIsAudioPlaying(true);
      });
    } else {
      audioRef.current.pause();
      setIsAudioPlaying(false);
    }
  };

  return (
    <div className={classNames("audio-player block h-auto w-fit", className)}>
      <audio ref={audioRef} src={activeTrack?.previewUrl} />
      <Button
        size="icon-lg"
        variant="default"
        onClick={() => togglePlayAudio()}
      >
        {isAudioPlaying ? <Pause /> : <Play />}
      </Button>
      {!!error && <p className="text-red-900">{error}</p>}
    </div>
  );
};

export default MusicAudioControl;

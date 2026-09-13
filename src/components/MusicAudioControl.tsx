import { useMusicPlayerContext } from "@/context/MusicPlayerContext";
import classNames from "classnames";
import { Pause, Play } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "./ui/button";

const MusicAudioControl = ({ className }: { className?: string }) => {
  const { activeTrack } = useMusicPlayerContext();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false); // false = not playing

  const togglePlayAudio = () => {
    if (!audioRef?.current) {
      setError("Unable to play audio");
      return;
    }

    if (audioRef.current.paused) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      });
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className={classNames("audio-player", className)}>
      <audio ref={audioRef} src={activeTrack?.previewUrl} />
      <Button
        size="icon-lg"
        variant="default"
        onClick={() => togglePlayAudio()}
      >
        {isPlaying ? <Pause /> : <Play />}
      </Button>
      {!!error && <p className="text-red-900">{error}</p>}
    </div>
  );
};

export default MusicAudioControl;

import { useMusicPlayerContext } from "@/context/MusicPlayerContext";
import classNames from "classnames";
import { Pause, Play } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "./ui/button";

const MusicAudioControl = ({ className }: { className?: string }) => {
  const { activeTrack } = useMusicPlayerContext();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const togglePlayAudio = () => {
    if (!audioRef?.current) {
      setError("Unable to play audio");
      return;
    }

    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
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
        {audioRef.current?.paused ? <Play /> : <Pause />}
      </Button>
      {!!error && <p className="text-red-900">{error}</p>}
    </div>
  );
};

export default MusicAudioControl;

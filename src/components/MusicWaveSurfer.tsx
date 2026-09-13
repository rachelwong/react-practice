import { useMusicPlayerContext } from "@/context/MusicPlayerContext";
import WavesurferPlayer from "@wavesurfer/react";
import { useState } from "react";

const MusicWaveSurfer = () => {
  const [_, setWavesurfer] = useState(null);

  const { activeTrack, setIsAudioPlaying } = useMusicPlayerContext();

  // correct type is WavesurferEventHandler<[duration: number]>
  const onReady = (ws: any) => {
    setWavesurfer(ws);
    setIsAudioPlaying(false);
  };

  return (
    <div className="w-full block">
      <WavesurferPlayer
        height={50}
        waveColor="violet"
        url={activeTrack?.previewUrl}
        onReady={onReady}
        onPlay={() => setIsAudioPlaying(true)}
        onPause={() => setIsAudioPlaying(false)}
      />
    </div>
  );
};

export default MusicWaveSurfer;

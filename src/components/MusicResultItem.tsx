import { useMusicPlayerContext } from "@/context/MusicPlayerContext";
import type { TrackResult } from "@/services/types/ItunesMusicSearchResponse";

const MusicResultItem = ({ track }: { track: TrackResult }) => {
  const { onSelectTrack } = useMusicPlayerContext();
  return (
    <button
      className="music-result-item flex relative flex-row align-stretch justify-between block border-1 border-slate-900"
      type="button"
      onClick={() => {
        onSelectTrack(track);
      }}
    >
      <div className="profile flex flex-row align-stretch gap-x-4 justify-start block w-2/3">
        <div className="profile-image w-30 h-30 block relative">
          <img
            src={track.artworkUrl100}
            alt={track.trackName}
            className="object-cover block w-full h-full relative"
          />
        </div>
        <div className="profile-content flex flex-col justify-start text-left align-center">
          <h3 className="text-sm font-extrabold text-slate-900">
            {track.trackName}
          </h3>
          <p className="text-xs text-slate-600">{track.artistName}</p>
          <p className="text-xs text-slate-500">{track.collectionName}</p>
        </div>
      </div>
      <div className="sound-wave w-1/3">Sound wave goes here</div>
    </button>
  );
};

export default MusicResultItem;

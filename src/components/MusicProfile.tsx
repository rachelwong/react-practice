import { useMusicPlayerContext } from "@/context/MusicPlayerContext";
import type { TrackResult } from "@/services/types/ItunesMusicSearchResponse";
import MusicAudioControl from "./MusicAudioControl";

const MusicProfile = () => {
  const { activeAlbum, activeTrack } = useMusicPlayerContext();
  const albumTracks = activeAlbum.filter(
    (x) => x.wrapperType.toLowerCase() === "track",
  ) as TrackResult[];

  const albumDetails = activeAlbum.find(
    (x) => x.wrapperType?.toLowerCase() === "collection",
  );

  if (!activeAlbum || !activeTrack) {
    return "";
  }

  return (
    <div className="overflow-y-auto flex flex-col align-center justify-start w-1/2 h-full z-10">
      <div className="mx-auto flex flex-col justify-center items-center">
        <div className="block w-20 h-20 relative">
          {!!albumDetails ? (
            <img
              src={albumDetails.artworkUrl100}
              alt={albumDetails.collectionName}
              className="object-cover block w-full h-full"
            />
          ) : (
            <span className="text-sm text-slate-900">No image</span>
          )}
        </div>
        {activeTrack?.previewUrl && <MusicAudioControl className="my-4" />}
      </div>
      <ul>
        {albumTracks.map((track) => (
          <li className="border-t border-slate-900 py-6 text-left">
            Track #{track.trackNumber} -{" "}
            <span className="font-extrabold">{track.trackName}</span> in{" "}
            <span>{track.collectionName}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MusicProfile;

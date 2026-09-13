import Layout from "@/components/Layout";
import MusicPlayerBar from "@/components/MusicPlayerBar";
import MusicPlayerSearch from "@/components/MusicPlayerSearch";
import MusicProfile from "@/components/MusicProfile";
import MusicSearchList from "@/components/MusicSearchList";
import { Spinner } from "@/components/ui/spinner";
import { useMusicPlayerContext } from "@/context/MusicPlayerContext";
import { Link } from "react-router";

const MusicPlayer = () => {
  const { activeTrack, loadingSearch } = useMusicPlayerContext();
  return (
    <Layout
      heading={
        <>
          <h3>Music player</h3>
          <p>
            Original brief from{" "}
            <Link to="/flip_code_challenge_fe.pdf" target="_blank">
              Open file here
            </Link>
          </p>
          <p>
            Uses open source API{" "}
            <a
              href="https://performance-partners.apple.com/search-api"
              target="_blank"
            >
              https://performance-partners.apple.com/search-api
            </a>
          </p>
        </>
      }
    >
      <div className="relative flex flex-col justify-between border-3 border-red-400 h-150 overflow-y-auto bg-slate-100">
        {loadingSearch && (
          <div className="absolute w-full h-full top-0 left-0 bottom-0 right-0 bg-opacity-50 bg-slate-300 flex flex-row align-center justify-center transition-opacity duration-500 ease-in-out pointer-events-none">
            <Spinner className="size-20" />
          </div>
        )}
        <MusicPlayerSearch />
        <div className="flex flex-row justify-between border-2 border-amber-300 h-full w-full relative">
          <MusicSearchList />
          <MusicProfile />
        </div>
        {/* TODO Only for mobile */}
        {activeTrack && <MusicPlayerBar />}
      </div>
    </Layout>
  );
};

export default MusicPlayer;

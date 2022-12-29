import Head from "next/head";
import Logo from "../components/index/LeftComponent/Logo";
import Menu from "../components/index/LeftComponent/Menu";
import Library from "../components/index/LeftComponent/Library";
import Customize from "../components/index/LeftComponent/Customize";
import Logout from "../components/index/LeftComponent/Logout";
import TrendingMusic from "../components/index/MiddleComponent/TrendingMusic";
import RecentlyPlayed from "../components/index/MiddleComponent/RecentlyPlayed";
import Account from "../components/index/RightComponent/Account";
import SearchBar from "../components/index/MiddleComponent/SearchBar";
import SearchResult from "../components/index/MiddleComponent/SearchResult";
import AudioPlayer from "../components/index/RightComponent/AudioPlayer";
import { useState } from "react";
import Loading from "./loading";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import Song from "../components/index/MiddleComponent/song";
import Recents from "../components/index/MiddleComponent/Recents";
import Favorites from "../components/index/MiddleComponent/Favorites";

export default function Home() {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
  if (user) {
    return <HomeComponent />;
  } else if (loading) {
    return <Loading />;
  } else {
    router.push("/authenticate");
  }
}

function HomeComponent() {
  const [active, setActive] = useState(1);
  const [search, setSearch] = useState("");
  const [songId, setSongId] = useState(null);
  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(null);
  const [currentSongId, setCurrentSongId] = useState(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  return (
    <>
      <Head>
        <title>Musicify</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-screen h-screen bg-gray-900 flex flex-row">
        {/* Left Section of the page */}
        <div className="h-full w-[250px] bg-[#1d242c] flex flex-col">
          <Logo active={active} setActive={setActive} />
          <Menu active={active} setActive={setActive} />
          <Library active={active} setActive={setActive} />
          <Customize active={active} setActive={setActive} />
          <Logout />
        </div>

        {/* Middle Section of the page */}
        <div className="h-full flex-1">
          {!songId ? (
            {
              1: (
                <>
                  <div className="h-[290px]">
                    <TrendingMusic />
                  </div>
                  <div className="h-[290px]">
                    <RecentlyPlayed setSongId={setSongId} />
                  </div>
                </>
              ),
              4: (
                <div className="flex flex-col h-screen">
                  <SearchBar search={search} setSearch={setSearch} />
                  <SearchResult search={search} setSongId={setSongId} />
                </div>
              ),
              5: (
                <div className="flex flex-col h-screen">
                  <Recents setSongId={setSongId} />
                </div>
              ),
              7: (
                <div className="flex flex-col h-screen">
                  <Favorites setSongId={setSongId} />
                </div>
              ),
            }[active]
          ) : (
            <div className="">
              <Song
                setSongId={setSongId}
                songId={songId}
                setQueue={setQueue}
                setIndex={setIndex}
                currentSongId={currentSongId}
                setCurrentSongId={setCurrentSongId}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
              />
            </div>
          )}
        </div>

        {/* Right Section of the page */}
        <div className="h-full w-[350px] bg-[#1d242c] flex flex-col">
          <Account />
          <AudioPlayer
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            queue={queue}
            currentIndex={index}
            setCurrentIndex={setIndex}
            currentSongId={currentSongId}
            setCurrentSongId={setCurrentSongId}
          />
        </div>
      </main>
    </>
  );
}

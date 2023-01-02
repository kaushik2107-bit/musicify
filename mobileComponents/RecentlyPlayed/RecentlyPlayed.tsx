import { Saira } from "@next/font/google";
import Image from "next/image";
const saira = Saira({ subsets: ["latin"] });
import { auth, app } from "../../lib/firebase";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  setDoc,
  getDoc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  doc,
  query,
  where,
  getDocs,
  increment,
  orderBy,
  limit,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState, useEffect } from "react";
import RecentlyPlayedSkeleton from "../../components/Skeletons/RecentlyPlayedSkeleton";
import TrendingText from "../../components/Skeletons/TrendingText";

export default function RecentlyPlayed({ setSongId }) {
  const [user, loading, error] = useAuthState(auth);
  const [tiles, setTiles] = useState([]);
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const db = getFirestore();
  const colRef = collection(db, "userInfo");
  const songRef = collection(db, "songs");
  const albumRef = collection(db, "album");

  const fetchRecentlyPlayed = async () => {
    setIsLoading(true);
    const docRef = doc(colRef, user.uid);
    const snap = await getDoc(docRef);
    const obj = snap.data().recentlyPlayed;
    let keys = Object.keys(obj);
    keys.sort((a, b) => new Date(obj[b]) - new Date(obj[a]));
    setTiles((prev) => keys);
  };

  const fetchSongsData = async () => {
    if (tiles.length) {
      const ids = tiles;
      let promises = [];
      ids.forEach((id) => {
        const docRef = doc(songRef, id);
        promises.push(getDoc(docRef));
      });
      let result = await Promise.all(promises);
      let ans = [];
      result.forEach((element) => {
        ans.push({ id: element.id, ...element.data() });
      });
      setSongs(ans);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentlyPlayed();
  }, []);

  useEffect(() => {
    if (tiles.length) fetchSongsData();
  }, [tiles]);

  return (
    <div className={saira.className}>
      <h4 className="my-4 text-[20px] text-[#aaa] font-medium uppercase">
        {!isLoading ? "Recently Played" : <TrendingText />}
      </h4>
      <div
        className="flex w-full overflow-scroll gap-2 h-[240px] flex-nowrap"
        style={{
          "&::WebkitScrollbar": { width: 0, height: 0, display: "none" },
          scrollbarWidth: "none",
        }}
      >
        {!isLoading ? (
          songs.map((item, index) => (
            <div
              key={index}
              className="w-[180px] h-[240px] hover:bg-[#1d242c] rounded-xl p-2 cursor-pointer"
              onClick={() => setSongId((prev) => item)}
            >
              <div className="w-[170px] h-[170px]">
                <Image
                  loader={() => item.imageURL}
                  src={item.imageURL}
                  width={170}
                  height={170}
                  alt={"image"}
                  className="rounded-md"
                />
              </div>
              <div className="w-[170px] h-[60px]">
                <div className="truncate text-[18px] px-[2px] text-[#eee] font-medium">
                  {item.songName || item.albumName}
                </div>
                <p className="text-[14px] px-[2px] text-[#999]">
                  {item.artistName}
                </p>
              </div>
            </div>
          ))
        ) : (
          <RecentlyPlayedSkeleton />
        )}
      </div>
    </div>
  );
}

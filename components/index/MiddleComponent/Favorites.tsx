import { auth, app } from "../../../lib/firebase";
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
import { Saira } from "@next/font/google";
const saira = Saira({ subsets: ["latin"] });
import Image from "next/image";
import TileSkeleton from "../../Skeletons/TileSkeleton";
import TrendingText from "../../Skeletons/TrendingText";

export default function Recents({ setSongId }) {
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
    const obj = snap.data().favorites;
    setTiles((prev) => obj);
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
    fetchSongsData();
  }, [tiles]);

  return (
    <div className={saira.className} style={{ overflow: "scroll" }}>
      <div className="text-[18px] uppercase font-medium text-[#eee] p-4">
        {!isLoading ? "Liked Songs" : <TrendingText />}
      </div>
      <div className="flex flex-wrap gap-2 p-4 items-center">
        {!isLoading ? (
          songs.map((item, index) => (
            <div
              key={index}
              className="lg:min-w-[500px] max-lg:min-w-[100%] h-fit flex-1 p-2 flex items-center gap-4 hover:bg-gray-800 cursor-pointer"
              onClick={() => setSongId((prev) => item)}
            >
              <Image
                loader={() => item.imageURL}
                src={item.imageURL}
                width={120}
                height={120}
                className="max-lg:w-[80px] max-lg:h-[80px]"
                alt={"image"}
              />
              <div className="text-[#ddd]">
                <p className="text-[20px]">{item.songName || item.albumName}</p>
                <div className="flex gap-2 items-center">
                  <p className="text-[14px] text-[#aaa]">{item.artistName}</p>
                  <p className="text-[12px] text-[#888]">
                    {item.songsArray?.length ? "Album" : "Song"}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <TileSkeleton />
        )}
      </div>
    </div>
  );
}

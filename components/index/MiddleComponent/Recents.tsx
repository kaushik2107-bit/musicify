import { auth, app } from "../../../pages/firebase";
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

export default function Recents({ setSongId }) {
  const [user, loading, error] = useAuthState(auth);
  const [tiles, setTiles] = useState([]);
  const [songs, setSongs] = useState([]);

  const db = getFirestore();
  const colRef = collection(db, "userInfo");
  const songRef = collection(db, "songs");
  const albumRef = collection(db, "album");

  const fetchRecentlyPlayed = async () => {
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
      <p className="text-[18px] uppercase font-medium text-[#eee] p-4">
        Recently Played
      </p>
      <div className="flex flex-wrap gap-2 p-4 items-center">
        {songs.map((item, index) => (
          <div
            key={index}
            className="min-w-[500px] h-fit flex-1 p-2 flex items-center gap-4 hover:bg-gray-800 cursor-pointer"
            onClick={() => setSongId((prev) => item)}
          >
            <Image
              loader={() => item.imageURL}
              src={item.imageURL}
              width={120}
              height={120}
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
        ))}
      </div>
    </div>
  );
}

import { Saira } from "@next/font/google";
import Image from "next/image";
const saira = Saira({ subsets: ["latin"] });
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

export default function RecentlyPlayed({ setSongId }) {
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
    <div className={saira.className}>
      <h4 className="my-4 text-[20px] text-[#aaa] font-medium uppercase">
        Recently Played
      </h4>
      <div className="flex flex-wrap gap-2 h-[230px] overflow-hidden">
        {songs.map((item, index) => (
          <div
            key={index}
            className="w-[170px] h-[220px] hover:bg-[#1d242c] rounded-xl flex flex-col p-2 cursor-pointer"
            onClick={() => setSongId((prev) => item)}
          >
            <Image
              loader={() => item.imageURL}
              src={item.imageURL}
              width={170}
              height={220}
              alt={"image"}
              className="rounded-md"
            />
            <p className="truncate text-[18px] px-[2px] text-[#eee] font-medium">
              {item.songName || item.albumName}
            </p>
            <p className="text-[14px] px-[2px] text-[#999]">
              {item.artistName}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

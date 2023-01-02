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

export default function Playlists({ setSongId, setActive }) {
  const [user, loading, error] = useAuthState(auth);
  const [tiles, setTiles] = useState([]);
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const db = getFirestore();
  const colRef = collection(db, "userInfo");
  const songRef = collection(db, "songs");
  const albumRef = collection(db, "album");
  const playlistRef = collection(db, "playlists");

  const fetchPlaylists = async () => {
    setIsLoading(true);
    const docRef = doc(colRef, user.uid);
    const snap = await getDoc(docRef);
    const data = snap.data().playlists;
    setTiles(data);
  };

  const fetchSongsData = async () => {
    if (tiles.length) {
      const ids = tiles;
      let promises = [];
      ids.forEach((id) => {
        const docRef = doc(playlistRef, id);
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

  console.log(songs);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  useEffect(() => {
    fetchSongsData();
  }, [tiles]);

  return (
    <div className={saira.className} style={{ overflow: "scroll" }}>
      <div className="text-[18px] uppercase font-medium text-[#eee] p-4 flex justify-between">
        <div className="">Playlists</div>
        <div
          className="text-[#777] cursor-pointer"
          onClick={() => setActive(8)}
        >
          New Playlist
        </div>
      </div>
      <div className="flex flex-wrap gap-2 p-4 items-center">
        {!isLoading ? (
          songs.map((item, index) => (
            <div
              key={index}
              className="lg:min-w-[500px] max-lg:min-w-[100%] h-fit flex-1 p-2 flex items-center gap-4 hover:bg-gray-800 cursor-pointer"
              onClick={() => setSongId((prev) => item)}
            >
              {item.songsArray.length >= 4 ? (
                <div className="w-[150px] h-[150px] max-lg:w-[80px] max-lg:h-[80px]">
                  <Image
                    width={150}
                    height={150}
                    className="max-lg:w-[80px] max-lg:h-[80px] absolute"
                    loader={() => item.imageURL[0]}
                    src={item.imageURL[0]}
                    style={{ clipPath: `polygon(0 0, 91% 0, 0 65%)` }}
                    alt={"image"}
                  />
                  <Image
                    width={150}
                    height={150}
                    className="max-lg:w-[80px] max-lg:h-[80px] absolute"
                    loader={() => item.imageURL[1]}
                    src={item.imageURL[1]}
                    style={{
                      clipPath: `polygon(0 68%, 52% 30%, 61% 100%, 0% 100%)`,
                    }}
                    alt={"image"}
                  />
                  <Image
                    width={150}
                    height={150}
                    className="max-lg:w-[80px] max-lg:h-[80px] absolute"
                    loader={() => item.imageURL[2]}
                    src={item.imageURL[2]}
                    style={{
                      clipPath: `polygon(100% 59%, 54% 30%, 63% 100%, 100% 100%)`,
                    }}
                    alt={"image"}
                  />
                  <Image
                    width={150}
                    height={150}
                    className="max-lg:w-[80px] max-lg:h-[80px] absolute"
                    loader={() => item.imageURL[3]}
                    src={item.imageURL[3]}
                    style={{
                      clipPath: `polygon(100% 57%, 55% 28%, 94% 0, 100% 0)`,
                    }}
                    alt={"image"}
                  />
                </div>
              ) : item.songsArray.length !== 0 ? (
                <Image
                  width={150}
                  height={150}
                  className="max-lg:w-[80px] max-lg:h-[80px]"
                  loader={() => item.imageURL[0]}
                  src={item.imageURL[0]}
                  alt={"image"}
                />
              ) : (
                <div className="w-[150px] h-[150px] max-lg:w-[80px] max-lg:h-[80px] bg-gray-700 text-gray-500 flex items-center justify-center text-[25px]">
                  IMAGE
                </div>
              )}
              <div className="text-[#ddd]">
                <p className="text-[20px]">{item.playlistName}</p>
                <div className="flex gap-2 items-center">
                  <p className="text-[14px] text-[#aaa]">
                    {item.songsArray.length} songs
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

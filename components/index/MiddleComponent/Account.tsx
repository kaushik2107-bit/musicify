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
import ImageSkeleton from "../../Skeletons/ImageSkeleton";
import { BiArrowBack } from "react-icons/bi";

export default function Account({ setActive }) {
  const [user, loading, error] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(false);

  const [favorites, setFavorites] = useState(0);
  const [playlists, setPlaylists] = useState(0);

  const db = getFirestore();
  const colRef = collection(db, "userInfo");
  const songRef = collection(db, "songs");
  const albumRef = collection(db, "album");

  const fetchData = async () => {
    setIsLoading(true);
    const docRef = doc(colRef, user.uid);
    const data = await getDoc(docRef);
    setFavorites(data.data().favorites.length);
    setPlaylists(data.data().playlists.length);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={saira.className} style={{ overflow: "scroll" }}>
      <div className="max-lg:text-center max-lg:p-8 text-[18px] uppercase font-medium text-[#eee] p-4">
        {!isLoading ? "Account Details" : <TrendingText />}
      </div>
      <div className="flex flex-col items-center">
        {!isLoading ? (
          <div className="p-2 rounded-full border-2 border-gray-400">
            <Image
              loader={() => user.photoURL}
              src={user.photoURL}
              width={200}
              height={200}
              alt={"profile"}
              className="rounded-full flex items-center justify-center text-gray-800 text-[30px] uppercase"
            />
          </div>
        ) : (
          <ImageSkeleton />
        )}
        <div className="text-[32px] w-full flex justify-center mt-2 text-white font-medium">
          {!isLoading ? (
            `${user.displayName}`
          ) : (
            <div className="p-2 w-full flex items-center justify-center">
              <TrendingText />
            </div>
          )}
        </div>
        <p className="text-[16px] text-gray-500 font-medium w-full flex justify-center">
          {!isLoading ? user.email : <TrendingText />}
        </p>
      </div>
      {!isLoading ? (
        <div className="w-[50%] m-auto h-[50px] mt-2 rounded-3xl bg-blue-600 flex items-center">
          <p className="flex-1 h-fit flex text-gray-200 justify-center items-center border-gray-400 border-r-[2px]">
            Playlists: {playlists}
          </p>
          <p className="flex-1 h-fit flex text-gray-200 justify-center items-center">
            Favorites: {favorites}
          </p>
        </div>
      ) : (
        <div className="p-2 py-4 w-full flex items-center justify-center">
          <TrendingText />
        </div>
      )}
    </div>
  );
}

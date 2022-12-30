import { Saira } from "@next/font/google";
import Slider from "react-slick";
import Card from "./Card";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState, useEffect } from "react";
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

const saira = Saira({ subsets: ["latin"] });

export default function TrendingMusic({
  songId,
  setSongId,
  setQueue,
  setIndex,
  currentSongId,
  setCurrentSongId,
  isPlaying,
  setIsPlaying,
}) {
  const [user, loading, error] = useAuthState(auth);
  const [cardsData, setCardsData] = useState([]);
  const db = getFirestore();
  const colRef = collection(db, "userInfo");
  const songRef = collection(db, "songs");
  const albumRef = collection(db, "album");

  const fetchTrending = async () => {
    const q = query(songRef, orderBy("streams", "desc"), limit(5));
    const data = await getDocs(q);
    let ans = [];
    data.forEach((element) => {
      ans.push({ id: element.id, ...element.data() });
    });
    setCardsData((prev) => [...ans]);
  };

  useEffect(() => {
    fetchTrending();
  }, []);

  const settings = {
    dots: false,
    autoplay: true,
    autoplaySpeed: 5000,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    speed: 500,
    arrows: false,
    adaptiveHeight: true,
  };

  return (
    <div className={saira.className} style={{ position: "relative" }}>
      <Slider {...settings} className="absolute w-full">
        {cardsData
          .map((item, index) => (
            <Card
              key={index}
              data={item}
              setSongId={setSongId}
              songId={songId}
              setQueue={setQueue}
              setIndex={setIndex}
              currentSongId={currentSongId}
              setCurrentSongId={setCurrentSongId}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
            />
          ))
          .reverse()}
      </Slider>
    </div>
  );
}

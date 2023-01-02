import {
  BiSearch,
  BiSkipNext,
  BiSkipPrevious,
  BiShuffle,
  BiChevronDown,
} from "react-icons/bi";
import { BsPlayCircleFill, BsPauseCircleFill } from "react-icons/bs";
import { FiRepeat } from "react-icons/fi";
import Slider from "react-input-slider";
import { Saira } from "@next/font/google";
const saira = Saira({ subsets: ["latin"] });
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
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
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { motion } from "framer-motion";

export default function AudioPlayerMobile({
  isPlaying,
  setIsPlaying,
  queue,
  currentIndex,
  setCurrentIndex,
  currentSongId,
  setCurrentSongId,
  setMaxAudioPlayer,
}) {
  const [user, loading, error] = useAuthState(auth);
  const [state, setState] = useState({ x: 0, y: 0 });
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoop, setIsLoop] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  const audioElement = useRef(null);
  const animateRef = useRef(null);

  const db = getFirestore();
  const colRef = collection(db, "userInfo");
  const songRef = collection(db, "songs");
  const albumRef = collection(db, "album");

  const convertTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    let ans;
    if (minutes < 10) ans = "0" + minutes;
    else ans = minutes;
    ans += ":";
    if (seconds < 10) ans += "0" + seconds;
    else ans += seconds;

    if (isNaN(minutes)) return "00:00";
    return ans;
  };

  const changeTime = (x) => {
    setCurrentTime(x);
    audioElement.current.currentTime = x;
  };

  const changeSlider = () => {
    setState((prev) => ({ ...prev, x: audioElement.current.currentTime }));
    setCurrentTime(audioElement.current.currentTime);
    animateRef.current = requestAnimationFrame(changeSlider);
  };

  const togglePlayPause = () => {
    if (isPlaying === true) {
      // setIsPlaying(false);
      audioElement.current.play();
      animateRef.current = requestAnimationFrame(changeSlider);
    } else {
      // setIsPlaying(true);
      audioElement.current.pause();
      cancelAnimationFrame(animateRef.current);
    }
  };

  useEffect(() => {
    if (queue.length) {
      togglePlayPause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (queue.length) {
      audioElement.current.play();
      animateRef.current = requestAnimationFrame(changeSlider);
    }
  }, [currentSongId]);

  const toggleLoop = () => {
    setIsLoop((prev) => !prev);
    if (audioElement.current.loop === true) {
      audioElement.current.loop = false;
    } else {
      audioElement.current.loop = true;
    }
  };

  const toggleShuffle = () => {
    setIsShuffle((prev) => !prev);
  };

  const playPrevious = () => {
    setIsLoop(false);
    let index = currentIndex - 1;
    if (index >= 0) setCurrentIndex(index);
    else setCurrentIndex(queue.length - 1);
  };

  const playNext = () => {
    setIsLoop(false);
    let index = currentIndex + 1;
    if (index < queue.length) setCurrentIndex(index);
    else setCurrentIndex(0);
  };

  useEffect(() => {
    if (isLoop === false && duration !== 0 && currentTime === duration) {
      let index = currentIndex + 1;
      if (index < queue.length) {
        setCurrentIndex(index);
      } else {
        setCurrentIndex(0);
      }
    }
  }, [currentTime]);

  useEffect(() => {
    if (currentIndex !== null) {
      setCurrentSongId(queue[currentIndex].id);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (queue.length) {
      audioElement.current.src = queue[currentIndex].songURL;
      audioElement.current.load();
      if (isPlaying) audioElement.current.play();
      audioElement.current.onloadedmetadata = () => {
        setDuration(audioElement.current.duration);
      };
    }
  }, [currentIndex]);

  useEffect(() => {
    if (queue.length) {
      audioElement.current.onloadedmetadata = () => {
        setDuration(audioElement.current.duration);
      };
      setCurrentTime(audioElement.current.currentTime);
      if (isPlaying) audioElement.current.play();
    }
  }, [audioElement?.current]);

  const updateStreams = async () => {
    const songDocRef = doc(songRef, currentSongId);
    await updateDoc(songDocRef, { streams: increment(1) });
    console.log("Updated");
  };

  const updateRecentlyPlayed = async () => {
    const userDocRef = doc(colRef, user.uid);
    const snap = await getDoc(userDocRef);
    let object = snap.data().recentlyPlayed;
    object = { ...object, [currentSongId]: new Date().toISOString() };
    await updateDoc(userDocRef, {
      recentlyPlayed: object,
    });
  };

  const handle = () => {
    let check = true;
    if (audioElement.current.currentTime >= 30 && check) {
      check = false;
      updateStreams();
      audioElement.current.removeEventListener("timeupdate", handle);
    }
  };

  useEffect(() => {
    if (audioElement.current) {
      audioElement.current.addEventListener("timeupdate", handle);
      audioElement.current.addEventListener("canplay", () => {
        updateRecentlyPlayed();
        console.log("Played");
      });
    }
  }, [audioElement.current?.src]);

  return (
    <>
      {queue.length !== 0 ? (
        <motion.div className={saira.className}>
          <audio
            src={queue[currentIndex].songURL}
            preload="metadata"
            ref={audioElement}
          />
          <div className="w-full h-full flex flex-row">
            <div className="w-[80px] px-2 ml-[10px] h-[80px] flex justify-center items-center">
              <Image
                className="rounded-xl"
                width={75}
                height={75}
                loader={() => queue[currentIndex].imageURL}
                src={queue[currentIndex].imageURL}
                alt={"songImage"}
              />
            </div>
            <div className="flex-1 flex flex-col justify-center mx-2 text-white">
              <p className="text-[16px]">{queue[currentIndex].songName}</p>
              <p className="text-[12px]">{queue[currentIndex].artistName}</p>
            </div>
            <div className="flex px-4 items-center">
              {!isPlaying ? (
                <BsPlayCircleFill
                  size={40}
                  onClick={() => (setIsPlaying(true), togglePlayPause())}
                  className="text-[50px] text-[#eee] cursor-pointer"
                />
              ) : (
                <BsPauseCircleFill
                  size={40}
                  onClick={() => (setIsPlaying(false), togglePlayPause())}
                  className="text-[50px] text-[#eee] cursor-pointer"
                />
              )}
            </div>
          </div>
        </motion.div>
      ) : (
        <></>
      )}
    </>
  );
}

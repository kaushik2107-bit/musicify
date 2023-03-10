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
import { motion, AnimatePresence } from "framer-motion";

export default function AudioPlayerMobile({
  isPlaying,
  setIsPlaying,
  queue,
  currentIndex,
  setCurrentIndex,
  currentSongId,
  setCurrentSongId,
  maxAudioPlayer,
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
      {queue.length !== 0 && (
        <audio
          src={queue[currentIndex].songURL}
          preload="metadata"
          ref={audioElement}
        />
      )}
      {queue.length !== 0 ? (
        maxAudioPlayer === true ? (
          <AnimatePresence>
            <div className="absolute w-screen rounded-xl left-1/2 transform -translate-x-1/2 bottom-0 bg-transparent h-screen z-10">
              <motion.div
                className={saira.className}
                initial={{ opacity: 0, y: "100vh" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "100vh" }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-gray-900 flex flex-col absolute w-screen h-screen cursor-pointer">
                  <div
                    className="p-2 pt-4 px-4 text-[#999] text-[16px] font-medium"
                    onClick={() => setMaxAudioPlayer(false)}
                  >
                    <BiChevronDown size={50} />
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center p-2">
                    <Image
                      className="bg-center bg-cover rounded-full"
                      width={150}
                      height={150}
                      sizes="100px"
                      loader={() => queue[currentIndex].imageURL}
                      src={queue[currentIndex].imageURL}
                      alt={"songImage"}
                    />
                    <p className="text-[30px] mt-8 w-[85%] text-center text-[#eee] font-medium truncate">
                      {queue[currentIndex].songName}
                    </p>
                    <p className="text-[24px] text-[#aaa] truncate">
                      {queue[currentIndex].artistName}
                    </p>
                    <div className="flex items-center text-[14px] gap-2 py-2">
                      <p className="text-[#eee] text-[16px] mx-2">
                        {convertTime(audioElement?.current?.currentTime)}
                      </p>
                      <Slider
                        axis="x"
                        x={state.x}
                        xmax={audioElement?.current?.duration}
                        onChange={({ x }) => (
                          setState((state) => ({ ...state, x })), changeTime(x)
                        )}
                        styles={{
                          track: {
                            backgroundColor: "#555",
                            height: "5px",
                            width: "250px",
                          },
                          active: {
                            backgroundColor: "white",
                          },
                          thumb: {
                            backgroundColor: "black",
                            border: "3px solid white",
                            width: "18px",
                            height: "18px",
                          },
                        }}
                      />
                      <p className="text-[#eee] text-[16px] mx-2">
                        {convertTime(audioElement?.current?.duration)}
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#1d242c] h-[200px] bg-[#09a0f4] flex justify-center items-center gap-2">
                    {isLoop ? (
                      <FiRepeat
                        size={35}
                        className="text-[20px] text-red-700 cursor-pointer"
                        onClick={toggleLoop}
                      />
                    ) : (
                      <FiRepeat
                        size={35}
                        className="text-[#eee] text-[20px] cursor-pointer"
                        onClick={toggleLoop}
                      />
                    )}
                    <BiSkipPrevious
                      size={70}
                      className="text-[40px] text-[#eee] cursor-pointer"
                      onClick={playPrevious}
                    />
                    {!isPlaying ? (
                      <BsPlayCircleFill
                        size={90}
                        onClick={() => (setIsPlaying(true), togglePlayPause())}
                        className="text-[50px] text-[#eee] cursor-pointer"
                      />
                    ) : (
                      <BsPauseCircleFill
                        size={90}
                        onClick={() => (setIsPlaying(false), togglePlayPause())}
                        className="text-[50px] text-[#eee] cursor-pointer"
                      />
                    )}
                    <BiSkipNext
                      size={70}
                      className="text-[40px] text-[#eee] cursor-pointer"
                      onClick={playNext}
                    />
                    {isShuffle ? (
                      <BiShuffle
                        size={70}
                        className="text-[20px] text-red-700 cursor-pointer"
                        onClick={toggleShuffle}
                      />
                    ) : (
                      <BiShuffle
                        size={35}
                        className="text-[#eee] text-[20px] cursor-pointer"
                        onClick={toggleShuffle}
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </AnimatePresence>
        ) : (
          <motion.div className={saira.className}>
            <div className="fixed border-2 w-[95%] rounded-xl left-1/2 transform -translate-x-1/2 bottom-[100px] bg-[#333] h-[80px]">
              <div
                className="w-full h-full flex flex-row cursor-pointer"
                onClick={() => setMaxAudioPlayer(true)}
              >
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
                  <p className="text-[12px]">
                    {queue[currentIndex].artistName}
                  </p>
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
            </div>
          </motion.div>
        )
      ) : (
        <></>
      )}
    </>
  );
}

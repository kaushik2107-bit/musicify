import {
  BiSearch,
  BiSkipNext,
  BiSkipPrevious,
  BiShuffle,
} from "react-icons/bi";
import { BsPlayCircleFill, BsPauseCircleFill } from "react-icons/bs";
import { FiRepeat } from "react-icons/fi";
import Slider from "react-input-slider";
import { Saira } from "@next/font/google";
const saira = Saira({ subsets: ["latin"] });
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
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
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

export default function AudioPLayer({
  isPlaying,
  setIsPlaying,
  queue,
  currentIndex,
  setCurrentIndex,
  currentSongId,
  setCurrentSongId,
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
        <div className={saira.className} style={{ margin: "14px" }}>
          <audio
            src={queue[currentIndex].songURL}
            preload="metadata"
            ref={audioElement}
          />
          <div className="h-[400px] bg-gray-900 rounded-3xl flex flex-col">
            <div className="p-2 pt-4 px-4 text-[#999] text-[16px] font-medium">
              Player
            </div>
            <div className="h-[250px] flex flex-col items-center p-2">
              <Image
                className="w-[120px] h-[120px] bg-center bg-cover rounded-full "
                width={120}
                height={120}
                loader={() => queue[currentIndex].imageURL}
                src={queue[currentIndex].imageURL}
                alt={"songImage"}
              />
              <p className="text-[24px] w-[85%] text-center text-[#eee] font-medium truncate">
                {queue[currentIndex].songName}
              </p>
              <p className="text-[16px] text-[#aaa] truncate">
                {queue[currentIndex].artistName}
              </p>
              <div className="flex items-center text-[14px] gap-2 py-2">
                <p className="text-[#eee] text-[12px]">
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
                      height: "3px",
                      width: "150px",
                    },
                    active: {
                      backgroundColor: "white",
                    },
                    thumb: {
                      backgroundColor: "black",
                      border: "3px solid white",
                      width: "14px",
                      height: "14px",
                    },
                  }}
                />
                <p className="text-[#eee] text-[12px]">
                  {convertTime(audioElement?.current?.duration)}
                </p>
              </div>
            </div>
            <div className="bg-[#1d242c] flex-1 bg-[#09a0f4] rounded-b-3xl flex justify-center items-center gap-2">
              {isLoop ? (
                <FiRepeat
                  className="text-[20px] text-red-700 cursor-pointer"
                  onClick={toggleLoop}
                />
              ) : (
                <FiRepeat
                  className="text-[#eee] text-[20px] cursor-pointer"
                  onClick={toggleLoop}
                />
              )}
              <BiSkipPrevious
                className="text-[40px] text-[#eee] cursor-pointer"
                onClick={playPrevious}
              />
              {!isPlaying ? (
                <BsPlayCircleFill
                  onClick={() => (setIsPlaying(true), togglePlayPause())}
                  className="text-[50px] text-[#eee] cursor-pointer"
                />
              ) : (
                <BsPauseCircleFill
                  onClick={() => (setIsPlaying(false), togglePlayPause())}
                  className="text-[50px] text-[#eee] cursor-pointer"
                />
              )}
              <BiSkipNext
                className="text-[40px] text-[#eee] cursor-pointer"
                onClick={playNext}
              />
              {isShuffle ? (
                <BiShuffle
                  className="text-[20px] text-red-700 cursor-pointer"
                  onClick={toggleShuffle}
                />
              ) : (
                <BiShuffle
                  className="text-[#eee] text-[20px] cursor-pointer"
                  onClick={toggleShuffle}
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

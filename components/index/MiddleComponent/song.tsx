import { useRouter } from "next/router";
import { BiArrowBack } from "react-icons/bi";
import Image from "next/image";
import { Saira } from "@next/font/google";
const saira = Saira({ subsets: ["latin"] });
import { BsHeartFill, BsHeart, BsPlayFill, BsPauseFill } from "react-icons/bs";
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
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState, useEffect } from "react";

export default function Song({
  songId,
  setSongId,
  setQueue,
  setIndex,
  currentSongId,
  setCurrentSongId,
  isPlaying,
  setIsPlaying,
}) {
  console.log(songId);
  const [user, loading, error] = useAuthState(auth);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isLikedAlbum, setIsLikedAlbum] = useState([]);
  const [songs, setSongs] = useState([]);
  const [likes, setLikes] = useState(0);
  const [streams, setStreams] = useState(0);

  const db = getFirestore();
  const colRef = collection(db, "userInfo");
  const songRef = collection(db, "songs");
  const albumRef = collection(db, "album");
  const playlistRef = collection(db, "playlists");

  const fetchLikesStreams = async () => {
    const docRef = doc(songRef, songId.id);
    const result = await getDoc(docRef);
    setLikes(result.data().likes);
    setStreams(result.data().streams);
  };

  const fetchLikesStreamsAlbum = async () => {
    const docRef = doc(albumRef, songId.id);
    const result = await getDoc(docRef);
    setLikes(result.data().likes);
    setStreams(result.data().streams);
  };

  const fetchLikesStreamsPlaylist = async () => {
    const docRef = doc(playlistRef, songId.id);
    const result = await getDoc(docRef);
    setLikes(result.data().likes);
    setStreams(result.data().streams);
  };

  //
  useEffect(() => {
    if (songId.songsArray) {
      if (songId.playlistName) {
        fetchLikesStreamsPlaylist();
      } else {
        fetchLikesStreamsAlbum();
      }
    } else {
      fetchLikesStreams();
    }
  }, []);

  const ifLiked = async () => {
    const docRef = doc(colRef, user.uid);
    const snapshot = await getDoc(docRef);
    const favorites = snapshot.data().favorites;
    if (favorites.includes(songId.id)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  };

  const ifLikedAlbum = async () => {
    const docRef = doc(colRef, user.uid);
    const snapshot = await getDoc(docRef);
    const favorites = snapshot.data().favorites;
    let data = [];
    songs.forEach((item) => {
      if (favorites.includes(item.id)) data.push(true);
      else data.push(false);
    });
    setIsLikedAlbum(data);
  };

  useEffect(() => {
    if (songId.songsArray) {
      ifLikedAlbum();
    } else {
      ifLiked();
    }
  }, [songs]);

  const setLiked = async () => {
    const docRef = doc(colRef, user.uid);
    const songDocRef = doc(songRef, songId.id);
    const snapshot = await getDoc(docRef);
    const data = snapshot.data().favorites;
    if (data.includes(songId.id)) {
      await updateDoc(docRef, {
        favorites: arrayRemove(songId.id),
      });
      await updateDoc(songDocRef, { likes: increment(-1) });
    } else {
      await updateDoc(docRef, {
        favorites: arrayUnion(songId.id),
      });
      await updateDoc(songDocRef, { likes: increment(1) });
    }
  };

  const setLikedAlbum = async (index) => {
    const docRef = doc(colRef, user.uid);
    const songDocRef = doc(songRef, songs[index].id);
    const snapshot = await getDoc(docRef);
    const data = snapshot.data().favorites;
    if (data.includes(songs[index].id)) {
      await updateDoc(docRef, {
        favorites: arrayRemove(songs[index].id),
      });
      await updateDoc(songDocRef, { likes: increment(-1) });
    } else {
      await updateDoc(docRef, {
        favorites: arrayUnion(songs[index].id),
      });
      await updateDoc(songDocRef, { likes: increment(1) });
    }
  };

  const setIsLikedAlbumF = (index) => {
    let data = isLikedAlbum;
    data[index] = !data[index];
    setIsLikedAlbum((prv) => [...data]);
  };

  const play = () => {
    setQueue((prev) => [songId]);
    setIndex(0);
    setCurrentSongId(songId.id);
    setIsPlaying(true);
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const playAlbum = (index) => {
    setQueue((prev) => songs);
    setIndex(index);
    setCurrentSongId(songs[index].id);
    setIsPlaying(true);
  };

  const pauseAlbum = () => {
    setIsPlaying(false);
  };

  const fetchSongsData = async () => {
    if (songId.songsArray) {
      const ids = songId.songsArray;
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
    fetchSongsData();
  }, [songId.songsArray]);

  const router = useRouter();
  return (
    <div className={saira.className}>
      <div className="h-screen overflow-scroll scrollbar scrollbar-thumb-gray-600 scrollbar-thin scrollbar-track-gray-400 scrollbar-w-[5px]">
        <button
          className="m-2 mx-4 absolute p-3 px-4 z-10 rounded-full bg-gray-700 "
          onClick={() => setSongId((prev) => null)}
        >
          <BiArrowBack className="text-[20px] text-gray-300" />
        </button>
        <div className="">
          <div className="h-[300px] max-lg:h-[350px] pt-10 w-full max-lg:flex-col flex items-center px-8 gap-2">
            {!songId.playlistName ? (
              <Image
                loader={() => songId.imageURL}
                src={songId.imageURL}
                width={200}
                height={200}
                alt={"image"}
              />
            ) : songId.songsArray.length >= 4 ? (
              <div className="w-[200px] h-[200px] relative">
                <Image
                  width={200}
                  height={200}
                  loader={() => songId.imageURL[0]}
                  src={songId.imageURL[0]}
                  className="absolute"
                  style={{ clipPath: `polygon(0 0, 91% 0, 0 65%)` }}
                />
                <Image
                  width={200}
                  height={200}
                  loader={() => songId.imageURL[1]}
                  src={songId.imageURL[1]}
                  className="absolute"
                  style={{
                    clipPath: `polygon(0 68%, 52% 30%, 61% 100%, 0% 100%)`,
                  }}
                />
                <Image
                  width={200}
                  height={200}
                  loader={() => songId.imageURL[2]}
                  src={songId.imageURL[2]}
                  className="absolute"
                  style={{
                    clipPath: `polygon(100% 59%, 54% 30%, 63% 100%, 100% 100%)`,
                  }}
                />
                <Image
                  width={200}
                  height={200}
                  loader={() => songId.imageURL[3]}
                  src={songId.imageURL[3]}
                  className="absolute"
                  style={{
                    clipPath: `polygon(100% 57%, 55% 28%, 94% 0, 100% 0)`,
                  }}
                />
              </div>
            ) : songId.songsArray.length !== 0 ? (
              <Image
                width={200}
                height={200}
                loader={() => songId.imageURL[0]}
                src={songId.imageURL[0]}
              />
            ) : (
              <div className="w-[200px] h-[200px] bg-gray-700 text-gray-500 flex items-center justify-center text-[25px]">
                IMAGE
              </div>
            )}
            <div className="flex-[1_1_0] min-w-0 max-lg:text-center max-lg:w-[95%]">
              <p className="truncate text-ellipsis text-[40px] text-white font-bold">
                {songId.songName || songId.albumName || songId.playlistName}
              </p>
              <p className="truncate text-ellipsis text-[20px] text-[#aaa]">
                {songId.artistName}
              </p>
            </div>
          </div>
        </div>
        <div className="flex text-[#777] gap-8 px-8 py-2 border-b-2 border-gray-700">
          <p className="">Streams: {streams}</p>
          <p className="">Likes: {likes}</p>
        </div>

        {!songId.songsArray ? (
          <div
            className={
              currentSongId === songId.id
                ? "m-4 flex h-[100px] p-[4px] items-center gap-2 hover:bg-gray-700 transition-all delay-75 rounded-xl cursor-pointer bg-gray-800"
                : "m-4 flex h-[100px] p-[4px] items-center gap-2 hover:bg-gray-700 transition-all delay-75 rounded-xl cursor-pointer"
            }
          >
            <Image
              loader={() => songId.imageURL}
              src={songId.imageURL}
              width={90}
              height={90}
              color={"#aaa"}
              alt={"image"}
              className="rounded-md"
            />
            <div className="text-[#ddd] flex-[1_1_0] truncate text-ellipsis">
              <p className="text-[20px] truncate text-ellipsis">
                {songId.songName}
              </p>
              <p className="text-[14px] text-[#aaa] truncate text-ellipsis">
                {songId.artistName}
              </p>
            </div>
            <div className="flex justify-center items-center w-[80px] h-full text-[20px]">
              {isLiked ? (
                <div
                  className="w-[60px] h-[60px] p-4 rounded-full hover:bg-cyan-600 hover:text-[#ccc] flex items-center justify-center text-cyan-600"
                  onClick={() => (setIsLiked((prev) => !prev), setLiked())}
                >
                  <BsHeartFill />
                </div>
              ) : (
                <div
                  className="w-[60px] h-[60px] p-4 rounded-full hover:bg-cyan-600 hover:text-[#ccc] flex items-center justify-center text-cyan-600"
                  onClick={() => (setIsLiked((prev) => !prev), setLiked())}
                >
                  <BsHeart />
                </div>
              )}
            </div>
            <div className="flex justify-center items-center w-[80px] h-full text-[30px]">
              {currentSongId === songId.id && isPlaying ? (
                <div
                  className="w-[60px] h-[60px] rounded-full hover:bg-cyan-600 hover:text-[#ccc] flex items-center justify-center text-cyan-600"
                  onClick={() => (setIsPlaying((prev) => !prev), pause())}
                >
                  <BsPauseFill />
                </div>
              ) : (
                <div
                  className="w-[60px] h-[60px] rounded-full hover:bg-cyan-600 hover:text-[#ccc] flex items-center justify-center text-cyan-600"
                  onClick={() => (setIsPlaying((prev) => !prev), play())}
                >
                  <BsPlayFill />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            {songs.map((item, index) => (
              <div
                key={index}
                className={
                  currentSongId === item.id
                    ? "m-4 flex h-[100px] p-[4px] items-center gap-2 hover:bg-gray-700 transition-all delay-75 rounded-xl cursor-pointer bg-gray-800"
                    : "m-4 flex h-[100px] p-[4px] items-center gap-2 hover:bg-gray-700 transition-all delay-75 rounded-xl cursor-pointer"
                }
              >
                <Image
                  loader={() => item.imageURL}
                  src={item.imageURL}
                  width={90}
                  height={90}
                  color={"#aaa"}
                  alt={"image"}
                  className="rounded-md"
                />
                <div className="text-[#ddd] flex-[1_1_0] truncate text-ellipsis">
                  <p className="text-[20px] truncate text-ellipsis">
                    {item.songName}
                  </p>
                  <p className="text-[14px] text-[#aaa] truncate text-ellipsis">
                    {item.artistName}
                  </p>
                </div>
                <div className="flex justify-center items-center w-[80px] h-full text-[20px]">
                  {isLikedAlbum[index] ? (
                    <div
                      className="w-[60px] h-[60px] p-4 rounded-full hover:bg-cyan-600 hover:text-[#ccc] flex items-center justify-center text-cyan-600"
                      onClick={() => (
                        setIsLikedAlbumF(index), setLikedAlbum(index)
                      )}
                    >
                      <BsHeartFill />
                    </div>
                  ) : (
                    <div
                      className="w-[60px] h-[60px] p-4 rounded-full hover:bg-cyan-600 hover:text-[#ccc] flex items-center justify-center text-cyan-600"
                      onClick={() => (
                        setIsLikedAlbumF(index), setLikedAlbum(index)
                      )}
                    >
                      <BsHeart />
                    </div>
                  )}
                </div>
                <div className="flex justify-center items-center w-[80px] h-full text-[30px]">
                  {currentSongId === item.id && isPlaying ? (
                    <div
                      className="w-[60px] h-[60px] rounded-full hover:bg-cyan-600 hover:text-[#ccc] flex items-center justify-center text-cyan-600"
                      onClick={() => (
                        setIsPlaying((prev) => !prev), pauseAlbum()
                      )}
                    >
                      <BsPauseFill />
                    </div>
                  ) : (
                    <div
                      className="w-[60px] h-[60px] rounded-full hover:bg-cyan-600 hover:text-[#ccc] flex items-center justify-center text-cyan-600"
                      onClick={() => (
                        setIsPlaying((prev) => !prev), playAlbum(index)
                      )}
                    >
                      <BsPlayFill />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

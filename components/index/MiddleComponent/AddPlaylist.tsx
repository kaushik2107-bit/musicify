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
import { FaPencilAlt } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import AbsoluteInput from "./AbsoluteInput";
import SongModal from "./SongModal";
import AbsoluteLoading from "../../Skeletons/AbsoluteLoading";
import SuccessModal from "./SuccessModal";

export default function AddPlaylist({ setActive }) {
  const [user, loading, error] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isSongModal, setIsSongModal] = useState(false);

  const [playlistName, setPlaylistName] = useState("");
  const [playlistSongs, setPlaylistSongs] = useState([]);

  const db = getFirestore();
  const colRef = collection(db, "userInfo");
  const songRef = collection(db, "songs");
  const albumRef = collection(db, "album");

  const removeSong = (item) => {
    var index = playlistSongs.indexOf(item);
    setPlaylistSongs((prev) => [
      ...prev.slice(0, index),
      ...prev.slice(index + 1),
    ]);
  };

  const savePlaylist = async () => {
    setIsLoading(true);
    let imageURL = [];
    if (playlistSongs.length < 4) {
      imageURL = [playlistSongs[0].imageURL];
    } else {
      imageURL = [
        playlistSongs[0].imageURL,
        playlistSongs[1].imageURL,
        playlistSongs[2].imageURL,
        playlistSongs[3].imageURL,
      ];
    }
    let ids = [];
    playlistSongs.forEach((el) => {
      ids.push(el.id);
    });
    const resource = {
      playlistName: playlistName,
      songsArray: ids,
      imageURL: [...imageURL],
      isPublic: false,
      likes: 0,
      streams: 0,
      uploaded_on: new Date().toISOString(),
    };

    const playlistRef = collection(db, "playlists");
    const docR = await addDoc(playlistRef, resource);

    const docRef = doc(colRef, user.uid);
    await updateDoc(docRef, {
      playlists: arrayUnion(docR.id),
    });
    setIsLoading(false);
    setSuccess(true);
  };

  return (
    <div className={saira.className}>
      {isVisible && (
        <AbsoluteInput
          setIsVisible={setIsVisible}
          playlistName={playlistName}
          setPlaylistName={setPlaylistName}
        />
      )}
      {isSongModal && (
        <SongModal
          setIsSongModal={setIsSongModal}
          playlistSongs={playlistSongs}
          setPlaylistSongs={setPlaylistSongs}
        />
      )}
      {isLoading && <AbsoluteLoading />}
      {success && <SuccessModal setActive={setActive} />}
      <div className="w-full h-screen flex flex-col">
        <p className="text-[18px] uppercase font-medium text-[#eee] p-4">
          Add Playlist
        </p>
        <div className="flex gap-2 p-2 px-4">
          {playlistSongs.length >= 4 ? (
            <div className="w-[250px] h-[250px]">
              <Image
                width={250}
                height={250}
                loader={() => playlistSongs[0].imageURL}
                src={playlistSongs[0].imageURL}
                className="absolute"
                style={{ clipPath: `polygon(0 0, 91% 0, 0 65%)` }}
              />
              <Image
                width={250}
                height={250}
                loader={() => playlistSongs[1].imageURL}
                src={playlistSongs[1].imageURL}
                className="absolute"
                style={{
                  clipPath: `polygon(0 68%, 52% 30%, 61% 100%, 0% 100%)`,
                }}
              />
              <Image
                width={250}
                height={250}
                loader={() => playlistSongs[2].imageURL}
                src={playlistSongs[2].imageURL}
                className="absolute"
                style={{
                  clipPath: `polygon(100% 59%, 54% 30%, 63% 100%, 100% 100%)`,
                }}
              />
              <Image
                width={250}
                height={250}
                loader={() => playlistSongs[3].imageURL}
                src={playlistSongs[3].imageURL}
                className="absolute"
                style={{
                  clipPath: `polygon(100% 57%, 55% 28%, 94% 0, 100% 0)`,
                }}
              />
            </div>
          ) : playlistSongs.length !== 0 ? (
            <Image
              width={250}
              height={250}
              loader={() => playlistSongs[0].imageURL}
              src={playlistSongs[0].imageURL}
            />
          ) : (
            <div className="w-[250px] h-[250px] bg-gray-700 text-gray-500 flex items-center justify-center text-[25px]">
              IMAGE
            </div>
          )}
          <div className="flex-1 flex items-center">
            <div className="flex flex-1 h-fit border-b-2 items-center border-gray-500">
              <div className="flex-1 text-white text-[30px] px-[4px] break-all font-medium">
                {playlistName}
              </div>
              <div
                className="p-2 ml-2 text-gray-500 hover:text-white cursor-pointer"
                onClick={() => setIsVisible(true)}
              >
                <FaPencilAlt />
              </div>
            </div>
            <AnimatePresence>
              {playlistSongs.length && playlistName.length && (
                <motion.div
                  initial={{ marginLeft: "20px", opacity: 0, scale: 0.5 }}
                  animate={{ marginLeft: "0px", opacity: 1, scale: 1 }}
                  exit={{ marginLeft: "20px", opacity: 0, scale: 0.5 }}
                  className="py-[4px] ml-2 text-white border-[1px] border-blue-500 hover:bg-blue-500 transition delay-50 rounded-3xl px-4 cursor-pointer"
                  onClick={savePlaylist}
                >
                  Save
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="bg-gray-800/[0.4] mt-2 p-2 px-4 flex items-center justify-between">
          <p className="text-gray-500 uppercase text-8">
            {playlistSongs.length
              ? `${playlistSongs.length} songs added`
              : "No songs added"}
          </p>
          <div
            className="w-fit p-2 px-8 my-2 rounded-3xl text-white bg-blue-500 cursor-pointer hover:bg-blue-600"
            onClick={() => setIsSongModal(true)}
          >
            Add songs
          </div>
        </div>
        <div className="pt-2 flex-1 overflow-scroll">
          {playlistSongs.map((item, index) => (
            <div
              className="flex p-2 px-4 items-center hover:bg-gray-800"
              key={index}
            >
              <Image
                loader={() => item.imageURL}
                src={item.imageURL}
                width={80}
                height={80}
                alt="Image"
              />
              <div className="p-2 flex-1">
                <p className="text-white">{item.songName}</p>
                <p className="text-gray-500 text-[14px]">{item.artistName}</p>
              </div>
              <div
                className="rounded-3xl p-2 text-[14px] w-[80px] text-center text-white border-2 border-blue-500 cursor-pointer"
                onClick={() => removeSong(item)}
              >
                Added
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

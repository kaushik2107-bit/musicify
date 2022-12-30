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
  deleteField,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState, useEffect } from "react";
import { MeiliSearch } from "meilisearch";
import Image from "next/image";
import { useRouter } from "next/router";
import { Saira } from "@next/font/google";
const saira = Saira({ subsets: ["latin"] });
import { MdOutlineCancel } from "react-icons/md";

export default function SearchResult({ search, setSongId }) {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);

  const db = getFirestore();
  const colRef = collection(db, "userInfo");
  const songRef = collection(db, "songs");
  const albumRef = collection(db, "album");

  const fetchSongs = async () => {
    const client = new MeiliSearch({
      host: process.env.NEXT_PUBLIC_SEARCH_HOST,
      apiKey: process.env.NEXT_PUBLIC_SEARCH_APIKEY,
    });
    const result = await client.index("songs").search(search);
    setResults(result.hits);
  };

  const storeHistory = async (item) => {
    const docRef = doc(colRef, user.uid);
    const snap = await getDoc(docRef);
    let object = snap.data().searchHistory;
    if (!object) {
      object = { [item.id]: { ...item, time: new Date().toISOString() } };
    } else {
      object = {
        ...object,
        [item.id]: { ...item, time: new Date().toISOString() },
      };
    }
    await updateDoc(docRef, {
      searchHistory: object,
    });
  };

  const fetchHistory = async () => {
    const docRef = doc(colRef, user.uid);
    const snap = await getDoc(docRef);
    let data = snap.data().searchHistory;
    if (data) {
      let keys = Object.keys(data);
      keys.sort((a, b) => new Date(data[b].time) - new Date(data[a].time));
      let ans = [];
      keys.forEach((key) => {
        ans.push(data[key]);
      });

      setHistory(ans);
    }
  };

  const deleteHistory = async (e, item, index) => {
    e.stopPropagation();
    let temp = history;
    temp.splice(index, 1);
    if (temp.length !== 1) {
      setHistory((prev) => [...temp]);
    } else {
      setHistory((prev) => []);
    }
    const docRef = doc(colRef, user.uid);
    const snap = await getDoc(docRef);
    let data = snap.data().searchHistory;
    const { [item.id]: foo, ...newData } = data;
    await updateDoc(docRef, {
      searchHistory: newData,
    });
  };

  const deleteAllHistory = async () => {
    setHistory((prev) => []);
    const docRef = doc(colRef, user.uid);
    await updateDoc(docRef, {
      searchHistory: deleteField(),
    });
  };

  useEffect(() => {
    if (search === "") {
      setResults((prev) => []);
    } else {
      fetchSongs();
    }
  }, [search]);

  useEffect(() => {
    fetchHistory();
  }, []);
  return (
    <div
      className={saira.className}
      style={{
        display: "flex",
        flexDirection: "column",
        flex: "1 1 0%",
      }}
    >
      {results.length != 0 ? (
        <div className="px-4 pt-2">
          <p className="text-[#888]">
            {results.length} {results.length == 1 ? "result" : "results"} found
          </p>
        </div>
      ) : (
        history.length != 0 && (
          <div className="px-4 pt-2" onClick={deleteAllHistory}>
            <p className="text-[#888] hover:text-[#aaa] cursor-pointer">
              Clear Recent Searches
            </p>
          </div>
        )
      )}
      <div className="flex-[1_1_0] p-4 overflow-scroll flex flex-col gap-2">
        {search.length ? (
          results.map((item, index) => (
            <div
              key={index}
              className="flex w-full h-[100px] p-2 items-center gap-2 hover:bg-gray-700 transition-all delay-75 rounded-xl cursor-pointer"
              onClick={() => (setSongId((prev) => item), storeHistory(item))}
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
          ))
        ) : history.length ? (
          history.map((item, index) => (
            <div
              key={index}
              className="flex w-full h-[100px] p-2 items-center gap-2 hover:bg-gray-700 transition-all delay-75 rounded-xl cursor-pointer"
              onClick={() => (setSongId((prev) => item), storeHistory(item))}
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
              <div className="text-[#ddd] flex-1">
                <p className="text-[20px]">{item.songName || item.albumName}</p>
                <div className="flex gap-2 items-center">
                  <p className="text-[14px] text-[#aaa]">{item.artistName}</p>
                  <p className="text-[12px] text-[#888]">
                    {item.songsArray?.length ? "Album" : "Song"}
                  </p>
                </div>
              </div>
              <div
                className="h-fit p-2 rounded-full w-fit flex justify-center items-center text-red-500 text-[30px] hover:text-red-700"
                onClick={(e) => deleteHistory(e, item, index)}
              >
                <MdOutlineCancel />
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex items-center justify-center text-[20px] text-gray-500">
            No Results Found
          </div>
        )}
      </div>
    </div>
  );
}

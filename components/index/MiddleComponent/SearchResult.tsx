import { auth, app } from "../../../lib/firebase";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  setDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { MeiliSearch } from "meilisearch";
import Image from "next/image";
import { useRouter } from "next/router";
import { Saira } from "@next/font/google";
const saira = Saira({ subsets: ["latin"] });

export default function SearchResult({ search, setSongId }) {
  const router = useRouter();
  const [results, setResults] = useState([]);
  const fetchSongs = async () => {
    const client = new MeiliSearch({
      host: process.env.NEXT_PUBLIC_SEARCH_HOST,
      apiKey: process.env.NEXT_PUBLIC_SEARCH_APIKEY,
    });
    const result = await client.index("songs").search(search);
    setResults(result.hits);
  };

  useEffect(() => {
    if (search === "") {
      setResults((prev) => []);
    } else {
      fetchSongs();
    }
  }, [search]);
  return (
    <div
      className={saira.className}
      style={{
        display: "flex",
        flexDirection: "column",
        flex: "1 1 0%",
      }}
    >
      {results.length != 0 && (
        <div className="flex justify-between px-4 pt-2">
          <p className="text-[#888]">
            {results.length} {results.length == 1 ? "result" : "results"} found
          </p>
          <p className="text-[#555] hover:text-[#aaa] cursor-pointer">
            Clear Recent Searches
          </p>
        </div>
      )}
      <div className="flex-[1_1_0] p-4 overflow-scroll flex flex-col gap-2">
        {results.map((item, index) => (
          <div
            key={index}
            className="flex w-full h-[100px] p-2 items-center gap-2 hover:bg-gray-700 transition-all delay-75 rounded-xl cursor-pointer"
            onClick={() => setSongId((prev) => item)}
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
        ))}
      </div>
    </div>
  );
}

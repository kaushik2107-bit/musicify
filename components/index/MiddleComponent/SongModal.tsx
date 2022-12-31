import { AiOutlineClose } from "react-icons/ai";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import SearchSkeleton from "../../Skeletons/SearchSkeleton";
import { MeiliSearch } from "meilisearch";
import Image from "next/image";

const AbsoluteInput = ({ setIsSongModal, setPlaylistSongs, playlistSongs }) => {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [results, setResults] = useState([]);

  const fetchSongs = async () => {
    setIsLoading(true);
    const client = new MeiliSearch({
      host: process.env.NEXT_PUBLIC_SEARCH_HOST,
      apiKey: process.env.NEXT_PUBLIC_SEARCH_APIKEY,
    });
    const result = await client
      .index("songs")
      .search(search, { filter: "NOT songsArray EXISTS" });
    setResults(result.hits);
    setIsLoading(false);
  };

  const isAdded = (item) => {
    let songs = playlistSongs;
    let check = songs.some((el) => el.id === item.id);
    if (check) return true;
    else return false;
  };

  const addSong = (item) => {
    setPlaylistSongs((prev) => [...prev, item]);
  };

  const removeSong = (item) => {
    var index = playlistSongs.indexOf(item);
    setPlaylistSongs((prev) => [
      ...prev.slice(0, index),
      ...prev.slice(index + 1),
    ]);
  };

  useEffect(() => {
    if (search === "") {
      setResults((prev) => []);
    } else {
      fetchSongs();
    }
  }, [search]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className=" left-0 absolute h-full w-full bg-gray-900/[0.7] z-10"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#111] rounded-xl w-[500px] h-[500px] flex flex-col"
      >
        <div className="w-full h-[60px] flex items-center p-2 px-4 justify-between">
          <p className="text-white">Add A Song</p>
          <div
            className="text-white p-2 hover:bg-gray-500 hover:text-black rounded-full cursor-pointer"
            onClick={() => setIsSongModal(false)}
          >
            <AiOutlineClose />
          </div>
        </div>
        <div className="h-[60px] flex items-center p-2 px-4 ">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus={true}
            placeholder={"Search a song"}
            className="bg-transparent text-white outline-none border-b-2 focus:border-blue-500 transition delay-50 border-gray-300 w-full placeholder:text-gray-600 p-[4px]"
          />
        </div>
        <div className="flex-1 overflow-scroll">
          {isLoading && <SearchSkeleton />}
          {!isLoading && results.length !== 0 && (
            <>
              {results.map((item, index) => (
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
                    <p className="text-gray-500 text-[14px]">
                      {item.artistName}
                    </p>
                  </div>
                  {isAdded(item) === false ? (
                    <div
                      className="rounded-3xl p-2 text-[14px] w-[80px] text-center text-white bg-blue-500 cursor-pointer"
                      onClick={() => addSong(item)}
                    >
                      Add
                    </div>
                  ) : (
                    <div
                      className="rounded-3xl p-2 text-[14px] w-[80px] text-center text-white border-2 border-blue-500 cursor-pointer"
                      onClick={() => removeSong(item)}
                    >
                      Added
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
          {!isLoading && results.length === 0 && (
            <div className="w-full h-full text-gray-500 flex items-center justify-center">
              No Songs Found
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AbsoluteInput;

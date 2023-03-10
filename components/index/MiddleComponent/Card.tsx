export default function Card({
  data,
  songId,
  setSongId,
  setQueue,
  setIndex,
  currentSongId,
  setCurrentSongId,
  isPlaying,
  setIsPlaying,
}) {
  const play = () => {
    setQueue((prev) => [data]);
    setIndex(0);
    setCurrentSongId(data.id);
    setIsPlaying(true);
  };

  return (
    <div
      className="bg-[#1d242c] h-[220px] w-full p-4 px-12 rounded-2xl bg-no-repeat bg-cover bg-right"
      style={{
        background: `linear-gradient(to right, #1d242c 15%, transparent, transparent, transparent), url(${data.imageURL})`,
      }}
    >
      <div className="flex flex-col h-full justify-center">
        <p className="text-[#ddd] font-bold text-[30px]">{data.songName}</p>
        <p className="text-[#999] font-medium text-[16px]">{data.artistName}</p>
        <div className="flex">
          <button
            className="bg-cyan-600 text-[#fff] font-medium mr-4 mt-8 px-6 py-2 rounded-3xl"
            onClick={() => play()}
          >
            Listen Now
          </button>
          <button className="bg-cyan-600 text-[#fff] font-medium mr-4 mt-8 px-6 py-2 rounded-3xl">
            Add to favourites
          </button>
        </div>
      </div>
    </div>
  );
}

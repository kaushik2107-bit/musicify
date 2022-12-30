export default function RecentlyPlayedSkeleton() {
  const counter = 9;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-4">
        {[...Array(counter)].map((e, i) => (
          <div className="flex flex-col gap-2">
            <div className="w-[170px] h-[180px] bg-gray-700 rounded-xl animate-pulse" />
            <div className="flex flex-col gap-[6px]">
              <div className="w-[150px] h-[15px] bg-gray-700 rounded-xl animate-pulse" />
              <div className="w-[80px] h-[10px] bg-gray-700 rounded-xl animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

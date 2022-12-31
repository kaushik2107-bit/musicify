export default function TileSkeleton() {
  const counter = 4;
  return (
    <div className="flex flex-col gap-2">
      {[...Array(counter)].map((e, i) => (
        <div className="flex w-full gap-2" key={i}>
          <div className="bg-gray-700 animate-pulse rounded-xl w-[120px] h-[120px]" />
          <div className="flex flex-col justify-center flex-1 h-[120px] gap-2">
            <div className="bg-gray-700 animate-pulse rounded-lg w-[500px] h-[25px]" />
            <div className="bg-gray-700 animate-pulse rounded-xl w-[160px] h-[10px]" />
          </div>
        </div>
      ))}
    </div>
  );
}

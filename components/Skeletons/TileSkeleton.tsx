export default function TileSkeleton() {
  const counter = 4;
  return (
    <div className="flex flex-col gap-2">
      {[...Array(counter)].map((e, i) => (
        <div className="flex w-full gap-2" key={i}>
          <div className="bg-gray-700 animate-pulse rounded-xl w-[120px] h-[120px] max-lg:w-[80px] max-lg:h-[80px]" />
          <div className="flex-1 flex flex-col justify-center h-[120px] max-lg:h-[80px] gap-2">
            <div className="bg-gray-700 animate-pulse rounded-lg w-[500px] max-lg:w-[100%] h-[25px]" />
            <div className="bg-gray-700 animate-pulse rounded-xl w-[160px] h-[10px]" />
          </div>
        </div>
      ))}
    </div>
  );
}

import { Saira } from "@next/font/google";
const saira = Saira({ subsets: ["latin"] });
import Favorites from "../../components/index/MiddleComponent/Favorites";
import Playlists from "../../components/index/MiddleComponent/Playlists";

export default function Library({ setSongId, active, setActive }) {
  return (
    <div className={saira.className}>
      <div className="text-[18px] uppercase font-medium text-[#eee] p-4 max-lg:text-[20px] max-lg:text-center max-lg:py-8">
        Library
      </div>
      <div className="w-full m-auto h-[60px] flex justify-center gap-8 items-center">
        <div
          className="border-[1px] text-white p-2 px-8 rounded-3xl cursor-pointer"
          style={
            active === 7
              ? { backgroundColor: "#09a0f4", borderColor: "#09a0f4" }
              : {}
          }
          onClick={() => setActive(7)}
        >
          Favorites
        </div>
        <div
          className="border-[1px] text-white p-2 px-8 rounded-3xl cursor-pointer"
          style={
            active === 6
              ? { backgroundColor: "#09a0f4", borderColor: "#09a0f4" }
              : {}
          }
          onClick={() => setActive(6)}
        >
          Playlists
        </div>
      </div>
      {active === 7 ? (
        <Favorites setSongId={setSongId} />
      ) : (
        <Playlists setSongId={setSongId} setActive={setActive} />
      )}
    </div>
  );
}

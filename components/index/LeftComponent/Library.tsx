import { useRouter } from "next/router";
import { Saira } from "@next/font/google";
import { AiOutlineHistory, AiFillHeart } from "react-icons/ai";
import { TbPlaylist } from "react-icons/tb";

const exo = Saira({ subsets: ["latin"] });

export default function Library({ active, setActive }) {
  const router = useRouter();
  return (
    <div className={exo.className}>
      <div className="my-4 pl-10">
        <h4 className="text-[#888] uppercase font-medium text-[14px]">
          Library
        </h4>
        <ul className="text-[#ccc] my-2">
          <li
            onClick={(e) => (
              e.preventDefault(), router.push("/"), setActive(() => 5)
            )}
            className="flex items-center py-1 hover:bg-[#09a0f4] rounded-l-[4px] hover:border-r-2 hover:text-[#eee] transition ease-in-out delay-90 cursor-pointer"
            style={
              active === 5
                ? { borderRight: "2px solid #09a0f4", color: "#09a0f4" }
                : {}
            }
          >
            <AiOutlineHistory className="mx-2" />
            Recent
          </li>
          <li
            onClick={(e) => (
              e.preventDefault(), router.push("/"), setActive(() => 6)
            )}
            className="flex items-center py-1 hover:bg-[#09a0f4] rounded-l-[4px] hover:border-r-2 hover:text-[#eee] transition-colors ease-in-out delay-90 cursor-pointer"
            style={
              active === 6
                ? { borderRight: "2px solid #09a0f4", color: "#09a0f4" }
                : {}
            }
          >
            {" "}
            <TbPlaylist className="mx-2" />
            Playlists
          </li>
          <li
            onClick={(e) => (
              e.preventDefault(), router.push("/"), setActive(() => 7)
            )}
            className="flex items-center py-1 hover:bg-[#09a0f4] rounded-l-[4px] hover:border-r-2 hover:text-[#eee] transition-colors ease-in-out delay-90 cursor-pointer"
            style={
              active === 7
                ? { borderRight: "2px solid #09a0f4", color: "#09a0f4" }
                : {}
            }
          >
            {" "}
            <AiFillHeart className="mx-2" />
            Favourites
          </li>
        </ul>
      </div>
    </div>
  );
}

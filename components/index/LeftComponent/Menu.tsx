import { useRouter } from "next/router";
import { Saira } from "@next/font/google";
import { AiFillHome, AiOutlineSearch } from "react-icons/ai";
import { HiTrendingUp } from "react-icons/hi";
import { MdMusicNote } from "react-icons/md";

const exo = Saira({ subsets: ["latin"] });

export default function Menu({ active, setActive }) {
  const router = useRouter();
  return (
    <div className={exo.className}>
      <div className="my-4 pl-10">
        <h4 className="text-[#888] uppercase font-medium text-[14px]">Menu</h4>
        <ul className="text-[#ccc] my-2">
          <li
            onClick={(e) => (
              e.preventDefault(), router.push("/"), setActive(() => 1)
            )}
            className="flex items-center py-1 hover:bg-[#09a0f4] rounded-l-[4px] hover:border-r-2 hover:text-[#eee] transition ease-in-out delay-90 cursor-pointer"
            style={
              active === 1
                ? { borderRight: "2px solid #09a0f4", color: "#09a0f4" }
                : {}
            }
          >
            <AiFillHome className="mx-2" />
            Home
          </li>
          <li
            onClick={(e) => (
              e.preventDefault(), router.push("/"), setActive(() => 2)
            )}
            className="flex items-center py-1 hover:bg-[#09a0f4] rounded-l-[4px] hover:border-r-2 hover:text-[#eee] transition-colors ease-in-out delay-90 cursor-pointer"
            style={
              active === 2
                ? { borderRight: "2px solid #09a0f4", color: "#09a0f4" }
                : {}
            }
          >
            {" "}
            <HiTrendingUp className="mx-2" />
            Trending
          </li>
          <li
            onClick={(e) => (
              e.preventDefault(), router.push("/"), setActive(() => 3)
            )}
            className="flex items-center py-1 hover:bg-[#09a0f4] rounded-l-[4px] hover:border-r-2 hover:text-[#eee] transition-colors ease-in-out delay-90 cursor-pointer"
            style={
              active === 3
                ? { borderRight: "2px solid #09a0f4", color: "#09a0f4" }
                : {}
            }
          >
            {" "}
            <MdMusicNote className="mx-2" />
            Mixes
          </li>
          <li
            onClick={(e) => (
              e.preventDefault(), router.push("/"), setActive(() => 4)
            )}
            className="flex items-center py-1 hover:bg-[#09a0f4] rounded-l-[4px] hover:border-r-2 hover:text-[#eee] transition ease-in-out delay-90 cursor-pointer"
            style={
              active === 4
                ? { borderRight: "2px solid #09a0f4", color: "#09a0f4" }
                : {}
            }
          >
            <AiOutlineSearch className="mx-2" />
            Search
          </li>
        </ul>
      </div>
    </div>
  );
}

import { useRouter } from "next/router";
import { Saira } from "@next/font/google";
import { IoMdSettings } from "react-icons/io";
import { MdAddBox } from "react-icons/md";
import { ImUser } from "react-icons/im";

const exo = Saira({ subsets: ["latin"] });

export default function Customize({ active, setActive }) {
  const router = useRouter();
  return (
    <div className={exo.className}>
      <div className="my-4 pl-10">
        <h4 className="text-[#888] uppercase font-medium text-[14px]">
          Customize
        </h4>
        <ul className="text-[#ccc] my-2">
          <li
            onClick={(e) => (
              e.preventDefault(), router.push("/"), setActive(() => 8)
            )}
            className="flex items-center py-1 hover:bg-[#09a0f4] rounded-l-[4px] hover:border-r-2 hover:text-[#eee] transition ease-in-out delay-90 cursor-pointer"
            style={
              active === 8
                ? { borderRight: "2px solid #09a0f4", color: "#09a0f4" }
                : {}
            }
          >
            <MdAddBox className="mx-2" />
            Add Playlist
          </li>
          <li
            onClick={(e) => (
              e.preventDefault(), router.push("/"), setActive(() => 9)
            )}
            className="flex items-center py-1 hover:bg-[#09a0f4] rounded-l-[4px] hover:border-r-2 hover:text-[#eee] transition-colors ease-in-out delay-90 cursor-pointer"
            style={
              active === 9
                ? { borderRight: "2px solid #09a0f4", color: "#09a0f4" }
                : {}
            }
          >
            {" "}
            <ImUser className="mx-2" />
            Account
          </li>
          <li
            onClick={(e) => (
              e.preventDefault(), router.push("/"), setActive(() => 10)
            )}
            className="flex items-center py-1 hover:bg-[#09a0f4] rounded-l-[4px] hover:border-r-2 hover:text-[#eee] transition-colors ease-in-out delay-90 cursor-pointer"
            style={
              active === 10
                ? { borderRight: "2px solid #09a0f4", color: "#09a0f4" }
                : {}
            }
          >
            {" "}
            <IoMdSettings className="mx-2" />
            Settings
          </li>
        </ul>
      </div>
    </div>
  );
}

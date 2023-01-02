import { auth } from "../../lib/firebase";
import { AiOutlineHistory } from "react-icons/ai";
import { IoSettingsSharp } from "react-icons/io5";
import { Saira } from "@next/font/google";
const saira = Saira({ subsets: ["latin"] });

export default function TopHeader({ active, setActive }) {
  return (
    <div className={saira.className} style={{ width: "100%", height: "100%" }}>
      <div className="flex items-center justify-between text-[#aaa] text-[30px] w-[90%] m-auto h-full">
        <p className="text-[24px] flex-1 font-bold">
          Hello, {auth.currentUser.displayName.split(" ")[0]}
        </p>
        <div className="cursor-pointer">
          <AiOutlineHistory className="mx-4" onClick={() => setActive(5)} />
        </div>
        <IoSettingsSharp className="ml-4" />
      </div>
    </div>
  );
}

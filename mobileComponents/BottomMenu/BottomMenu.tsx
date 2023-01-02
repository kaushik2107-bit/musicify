import { AiFillHome, AiOutlineSearch } from "react-icons/ai";
import { CgStack } from "react-icons/cg";
import { CgProfile } from "react-icons/cg";
export default function BottomMenu({ active, setActive }) {
  return (
    <div className="flex items-center justify-between px-4 text-[#aaa] w-[90%] m-auto h-full">
      <div className="cursor-pointer">
        <AiFillHome
          className="text-[30px] "
          style={active === 1 ? { color: "#09a0f4" } : {}}
          onClick={() => setActive(1)}
        />
      </div>
      <div className="cursor-pointer">
        <AiOutlineSearch
          className="text-[30px] "
          style={active === 4 ? { color: "#09a0f4" } : {}}
          onClick={() => setActive(4)}
        />
      </div>
      <div className="cursor-pointer">
        <CgStack
          className="text-[30px] "
          style={active === 7 || active === 6 ? { color: "#09a0f4" } : {}}
          onClick={() => setActive(7)}
        />
      </div>
      <div className="cursor-pointer">
        <CgProfile
          className="text-[30px] "
          style={active === 9 ? { color: "#09a0f4" } : {}}
          onClick={() => setActive(9)}
        />
      </div>
    </div>
  );
}

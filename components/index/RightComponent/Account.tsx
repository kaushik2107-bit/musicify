import { Saira } from "@next/font/google";
import { auth } from "../../../lib/firebase";

const saira = Saira({ subsets: ["latin"] });

export default function Account({ setActive }) {
  return (
    <div className={saira.className}>
      <div className="flex h-[60px] items-center justify-between pr-2 gap-2 border-b-[1px] border-gray-700">
        <p className="uppercase text-[#ccc] text-[14px] font-medium ml-4">
          Upgrade Plan
        </p>
        <div className="flex items-center gap-2 mr-4">
          <p className="text-[#ddd] font-semibold">
            {auth.currentUser.displayName.split(" ")[0]}
          </p>
          <div
            className="border-2 border-gray-500 p-[2px] flex items-center justify-center rounded-full cursor-pointer"
            onClick={() => setActive(9)}
          >
            <div
              className="bg-blue-800 w-[40px] h-[40px] rounded-full bg-cover bg-center"
              style={{ backgroundImage: `url(${auth.currentUser.photoURL})` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

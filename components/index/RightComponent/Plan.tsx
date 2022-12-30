import { Saira } from "@next/font/google";
const saira = Saira({ subsets: ["latin"] });
import Image from "next/image";
import { TiTick } from "react-icons/ti";

export default function Plan() {
  return (
    <div
      className={saira.className}
      style={{
        flex: "1 1 0%",
        padding: "10px",
        overflow: "hidden",
      }}
    >
      <div
        className="h-full rounded-2xl max-h-[200px]"
        style={{
          background:
            "rgb(2,0,36) linear-gradient(135deg, rgba(2,0,230,1) 0%, rgba(2,174,230,1) 59%, rgba(0,200,240,1) 70%, rgba(0,212,255,1) 99%)",
        }}
      >
        <div className="flex justify-center items-center p-4 gap-2 rounded-t-xl bg-gray-900/[0.3]">
          <p className="text-white text-[20px] font-bold">Musicify Free</p>
        </div>

        <ul className="py-2">
          <li className="flex items-center justify-center font-medium text-gray-100">
            <TiTick className="text-green-400 text-[30px]" />
            High quality music
          </li>
          <li className="flex items-center justify-center font-medium text-gray-100">
            <TiTick className="text-green-400 text-[30px]" />
            Without ad interruptions
          </li>
        </ul>
      </div>
    </div>
  );
}

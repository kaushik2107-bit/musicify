import { Saira } from "@next/font/google";
import { BiSearch } from "react-icons/bi";
import { useState } from "react";
const saira = Saira({ subsets: ["latin"] });

export default function SearchBar({ search, setSearch }) {
  const handleSubmit = () => {};
  return (
    <div className={saira.className}>
      <div className="">
        <p className="text-[18px] uppercase font-medium text-[#eee] p-4">
          Quick Search
        </p>
        <div className="h-[50px] flex pl-4 bg-gray-900 border-2 border-gray-700 rounded-3xl mx-4 gap-2">
          <input
            type="text"
            className="bg-transparent flex-1 w-[90%] outline-none text-[#eee] m-[10px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div
            className="cursor-pointer bg-cyan-700 w-[80px] h-full flex items-center justify-center text-white rounded-r-3xl"
            onClick={handleSubmit}
          >
            <BiSearch className="text-[25px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

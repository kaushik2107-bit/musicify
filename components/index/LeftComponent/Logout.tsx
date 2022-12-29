import { HiLogout } from "react-icons/hi";
import { Saira } from "@next/font/google";
import { auth } from "../../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";

const exo = Saira({ subsets: ["latin"] });

export default function Logout() {
  return (
    <div
      className={exo.className}
      style={{
        flex: "1 1 0%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <div
        onClick={() => auth.signOut()}
        className="w-full flex items-center pl-10 p-2 py-4 bg-[#183555] text-[#eee] cursor-pointer"
      >
        <HiLogout className="mx-2" />
        Logout
      </div>
    </div>
  );
}

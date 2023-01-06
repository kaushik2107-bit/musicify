import Logo from "../components/index/LeftComponent/Logo";
import GoogleButton from "react-google-button";
import { Saira } from "@next/font/google";
const saira = Saira({ subsets: ["latin"] });
import { auth } from "../lib/firebase";
import {
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Loading from "./loading";
import axios from "axios";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  setDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { TiTick } from "react-icons/ti";

export default function Authenticate() {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);

  const postData = async () => {
    try {
      const db = getFirestore();
      const colRef = collection(db, "userInfo");
      const resource = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        recentlyPlayed: [],
        playlists: [],
        favorites: [],
      };
      const q = query(colRef, where("uid", "==", resource.uid));
      const querySnapshot = await getDocs(q);
      let docs = [];
      querySnapshot.forEach((doc) => {
        docs.push(doc.data());
      });
      console.log(docs);
      if (docs.length) return;
      await setDoc(doc(colRef, user.uid), resource);
      console.log("Document Added");
    } catch (err) {
      console.log(err);
    }
  };
  if (user) {
    postData();
    router.push("/");
  } else if (loading) {
    return <Loading />;
  } else {
    return <AuthenticateComponent />;
  }
}

function AuthenticateComponent() {
  const router = useRouter();
  const googleAuth = new GoogleAuthProvider();

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuth);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={saira.className}>
      <div
        className="bg-gray-900 w-screen h-screen bg-cover bg-center flex flex-col items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.8)), url(/loginImages/image.jpg)`,
        }}
      >
        <div className="absolute top-0 left-0 transform left-1/2 -translate-x-1/2">
          <Logo />
        </div>
        <div className="w-screen flex max-md:flex-col-reverse max-md:items-center">
          <div className="w-[40%] flex flex-col justify-center items-center">
            <p className="text-[#aaa] text-center">Join Now</p>
            <div className="p-4">
              <GoogleButton onClick={login} />
            </div>
          </div>
          <div className="flex-1 border-l-2 border-[#666] px-6 py-8 max-md:border-none max-md:hidden">
            <p className="text-blue-500 font-medium text-[45px]">
              Get the right music, right now
            </p>
            <p className="text-[#999] text-[16px]">
              Listen to million of songs for free
            </p>
            <ul className="text-[#bbb] py-4 text-[14px]">
              <li className="flex items-center">
                <TiTick className="text-blue-500 text-[20px]" />
                Search & discover music you'll love
              </li>
              <li className="flex items-center">
                <TiTick className="text-blue-500 text-[20px]" />
                Create playlists of your favorite music
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

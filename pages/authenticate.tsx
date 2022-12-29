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
        <div className="px-20 py-5 flex items-center">
          <p className="text-white text-[50px]">Welcome to</p>
          <Logo />
        </div>
        <GoogleButton onClick={login} />
      </div>
    </div>
  );
}

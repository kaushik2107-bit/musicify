import { useState, useEffect } from "react";
import { app } from "./firebase";
import { v4 } from "uuid";
import Image from "next/image";
import { MeiliSearch } from "meilisearch";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
  getStorage,
} from "firebase/storage";
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
const storage = getStorage(app);

export default function upload() {
  const [imageUpload, setImageUpload] = useState(null);
  const [songUplaod, setSongUpload] = useState(null);
  const [songName, setSongName] = useState(null);
  const [artistName, setArtistName] = useState(null);

  const [tiles, setTiles] = useState([]);

  const imagesListRef = ref(storage, "images/");
  const uploadImage = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    return new Promise((resolve, reject) => {
      uploadBytes(imageRef, imageUpload).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          resolve(url);
        });
      });
    });
  };

  const uploadSong = () => {
    if (songUplaod == null) return;
    const songRef = ref(storage, `songs/${songUplaod.name + v4()}`);
    return new Promise((resolve, reject) => {
      uploadBytes(songRef, songUplaod).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          resolve(url);
        });
      });
    });
  };

  const refreshTiles = () => {
    const db = getFirestore();
    const colRef = collection(db, "songs");
    getDocs(colRef).then((snapshot) => {
      let array = [];
      snapshot.forEach((doc) => {
        array.push(doc.data());
      });
      setTiles((prev) => [...array]);
    });
  };

  const temp = async (doc) => {
    const client = new MeiliSearch({
      host: `https://ms-3a1bc74552dc-1260.lon.meilisearch.io/`,
      apiKey: `cceeeff9de501cfa41cd34c8a5d0c9363e95f711`,
    });
    await client.index("songs").addDocuments(doc);
  };

  const uploadData = async () => {
    try {
      console.log("Uploading");
      const songURL = await uploadSong();
      const imageURL = await uploadImage();
      console.log("Files uploaded");
      const db = getFirestore();
      const colRef = collection(db, "songs");
      const resource = {
        songName: songName,
        artistName: artistName,
        songURL: songURL,
        imageURL: imageURL,
        streams: 0,
        likes: 0,
        uploaded_on: new Date().toISOString(),
      };
      const docRef = await addDoc(colRef, resource);
      await temp({ ...resource, id: docRef.id });
      console.log("Song Uploaded");
      refreshTiles();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    refreshTiles();
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col gap-2 p-2 overflow-scroll">
      <div className="flex flex-col h-fit gap-2">
        <label>Song Name</label>
        <input
          type="text"
          className="border-2 border-black"
          required={true}
          onChange={(e) => setSongName(e.target.value)}
        />
        <label>Artist Name</label>
        <input
          type="text"
          className="border-2 border-black"
          required={true}
          onChange={(e) => setArtistName(e.target.value)}
        />
        <label>Audio File</label>
        <input
          type="file"
          className="border-2 border-black"
          required={true}
          onChange={(e) => setSongUpload(e.target.files[0])}
        />
        <label>Image File</label>
        <input
          type="file"
          className="border-2 border-black"
          required={true}
          onChange={(e) => setImageUpload(e.target.files[0])}
        />
        <button
          className="w-full h-10 border-2 border-gray-400 bg-gray-300"
          onClick={uploadData}
        >
          Add Song
        </button>
      </div>

      <div className="flex-[1_1_0] overflow-scroll">
        {tiles
          .map((item, index) => (
            <div
              key={index}
              className="flex border-2 border-black w-full h-[80px] overflow-scroll"
            >
              <Image
                loader={() => item.imageURL}
                src={item.imageURL}
                width={80}
                height={80}
                alt={"Image"}
              />
              <div className="flex-1">
                <p className="">{item.songName}</p>
                <p className="">{item.artistName}</p>
              </div>
              <p className="w-10">{item.likes}</p>
              <p className="w-10">{item.streams}</p>
            </div>
          ))
          .reverse()}
      </div>
    </div>
  );
}

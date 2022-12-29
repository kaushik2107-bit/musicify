import { useState, useEffect } from "react";
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
import { app } from "./firebase";
import Image from "next/image";
import { v4 } from "uuid";
import { MeiliSearch } from "meilisearch";
const storage = getStorage(app);

export default function UploadAlbum() {
  const [tiles, setTiles] = useState([]);
  const [album, setAlbum] = useState([]);
  const [albumName, setAlbumName] = useState(null);
  const [artistName, setArtistName] = useState(null);
  const [imageUpload, setImageUpload] = useState(null);

  const imagesListRef = ref(storage, "albumImages/");
  const uploadImage = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `albumImages/${imageUpload.name + v4()}`);
    return new Promise((resolve, reject) => {
      uploadBytes(imageRef, imageUpload).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          resolve(url);
        });
      });
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
      const imageURL = await uploadImage();
      console.log("Files uploaded");
      const db = getFirestore();
      const colRef = collection(db, "album");
      const resource = {
        albumName: albumName,
        artistName: artistName,
        imageURL: imageURL,
        streams: 0,
        likes: 0,
        songsArray: album,
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

  const refreshTiles = () => {
    const db = getFirestore();
    const colRef = collection(db, "songs");
    getDocs(colRef).then((snapshot) => {
      let array = [];
      snapshot.forEach((doc) => {
        array.push({ id: doc.id, ...doc.data() });
      });
      setTiles((prev) => [...array]);
    });
  };

  useEffect(() => {
    refreshTiles();
  }, []);

  const handleClick = (item) => {
    const data = item.id;
    setAlbum((prev) => [...prev, data]);
  };

  const handleSubmit = () => {};

  return (
    <>
      <div className="flex flex-col h-fit gap-2 p-2">
        <label>Album Name</label>
        <input
          type="text"
          className="border-2 border-black"
          required={true}
          onChange={(e) => setAlbumName(e.target.value)}
        />

        <label>Artist Name</label>
        <input
          type="text"
          className="border-2 border-black"
          required={true}
          onChange={(e) => setArtistName(e.target.value)}
        />

        <label>Album Cover</label>
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
          Submit
        </button>
      </div>
      <div className="flex-[1_1_0] overflow-scroll p-2 flex flex-col gap-2">
        {tiles
          .map((item, index) => (
            <div
              key={index}
              className="flex border-2 border-black w-full h-[80px] overflow-scroll"
            >
              <div className="flex justify-center items-center p-4">
                <input
                  type="checkbox"
                  className=""
                  onClick={() => handleClick(item)}
                />
              </div>
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
    </>
  );
}

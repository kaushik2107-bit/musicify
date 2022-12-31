import { AiOutlineClose } from "react-icons/ai";
import { motion } from "framer-motion";

const AbsoluteInput = ({ setIsVisible, setPlaylistName, playlistName }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className=" left-0 absolute h-full w-full bg-gray-900/[0.7] z-10"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#111] rounded-xl w-[500px] h-[150px]"
      >
        <div className="w-full h-[60px] flex items-center p-2 px-4 justify-between">
          <p className="text-white">Playlist Name</p>
          <div
            className="text-white p-2 hover:bg-gray-500 hover:text-black rounded-full cursor-pointer"
            onClick={() => setIsVisible(false)}
          >
            <AiOutlineClose />
          </div>
        </div>
        <div className="h-[90px] flex items-center p-2 px-4">
          <input
            type="text"
            value={playlistName}
            autoFocus={true}
            className="bg-transparent w-full h-[50px] outline-none border-b-2 focus:border-blue-500 transition delay-50 text-white p-2 mb-4"
            onChange={(e) => setPlaylistName(e.target.value)}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AbsoluteInput;

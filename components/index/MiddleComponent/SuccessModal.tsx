import { AiOutlineClose } from "react-icons/ai";
import { motion } from "framer-motion";
import { BsCheckLg } from "react-icons/bs";

const SuccessModal = ({ setActive }) => {
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
        className="absolute top-1/2 left-1/2 text-white transform -translate-x-1/2 -translate-y-1/2 bg-[#111] rounded-xl w-[400px] h-[150px] flex flex-col items-center justify-center"
      >
        <BsCheckLg className="text-[30px] m-2 text-green-500" />
        <p>Playlist Added</p>
        <div
          className="my-2 px-4 p-[4px] text-[14px] rounded-3xl bg-blue-500 text-white cursor-pointer"
          onClick={() => setActive(6)}
        >
          Check Playlists
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SuccessModal;

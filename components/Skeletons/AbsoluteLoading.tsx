import { motion } from "framer-motion";
import { ClipLoader } from "react-spinners";

const AbsoluteLoading = ({ setIsVisible, setPlaylistName, playlistName }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className=" left-0 absolute h-full w-full bg-gray-900/[0.7] z-10 flex items-center justify-center"
    >
      <ClipLoader color="#36d7b7" />
    </motion.div>
  );
};

export default AbsoluteLoading;

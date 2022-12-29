import { BeatLoader } from "react-spinners";
export default function Loading() {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-900">
      <BeatLoader color="#36d7b7" />
    </div>
  );
}

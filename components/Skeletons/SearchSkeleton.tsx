import { ClipLoader } from "react-spinners";

export default function SearchSkeleton() {
  return (
    <div className="flex justify-center h-full items-center">
      <ClipLoader color="#36d7b7" />
    </div>
  );
}

import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex justify-center items-center p-4 px-12 pt-6">
      <Image alt="LOGO" src="/Vector.png" width="200" height="60" />
    </div>
  );
}

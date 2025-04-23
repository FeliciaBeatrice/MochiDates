import Image from "next/image";

export default function Header() {
  return (
    <header className="p-4 flex items-center gap-3">
      <Image
        src="/logo.png"
        alt="MochiDates Logo"
        width={50}
        height={50}
        className="rounded"
      />
    </header>
  );
}
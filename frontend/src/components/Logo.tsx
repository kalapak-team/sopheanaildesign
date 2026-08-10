import Image from "next/image";
import Link from "next/link";

export function Logo({ className = "h-14 w-14" }: { className?: string }) {
  return (
    <Link href="/" className={`relative inline-flex items-center ${className}`} aria-label="Sophea Naildesign">
      <Image
        src="/images/brand/logo.png"
        alt="Sophea Naildesign"
        width={120}
        height={120}
        className="h-full w-full object-contain"
        priority
      />
    </Link>
  );
}

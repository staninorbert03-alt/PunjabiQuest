"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Book, Languages } from "lucide-react";

export function MobileTabs() {
  const path = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-700 h-16 flex justify-around items-center">
      
      <Link href="/translate" className="flex flex-col items-center text-white">
        <Languages
          className={path.includes("translate") ? "text-green-400" : "text-gray-400"}
        />
        <span className="text-xs">Dolmetscher</span>
      </Link>

      <Link href="/learn" className="flex flex-col items-center text-white">
        <Book
          className={path.includes("learn") ? "text-green-400" : "text-gray-400"}
        />
        <span className="text-xs">Lernen</span>
      </Link>

    </div>
  );
}
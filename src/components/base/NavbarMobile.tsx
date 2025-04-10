"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import GithubButton from "./GithubButton";
import YouTubeButton from "./YoutubeButton";
import { NavbarConfig } from "@/constants";
import { User } from "@supabase/supabase-js";

type Props = {
  user: User | null;
};

export default function MobileMenu({ user }: Props) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen((cur) => !cur);
    document.body.classList.toggle("overflow-hidden", !open);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1260) {
        setOpen(false);
        document.body.classList.remove("overflow-hidden");
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <button
        className="text-black hover:bg-black/10 p-2 rounded-lg transition"
        onClick={handleOpen}
      >
        <span className="sr-only">
          {open ? "Menü schließen" : "Menü öffnen"}
        </span>
        <div className="relative w-8 h-8">
          <XMarkIcon
            className={`absolute w-8 h-8 transition-transform duration-300 ${
              open ? "rotate-0 opacity-100" : "rotate-90 opacity-0"
            }`}
          />
          <Bars3Icon
            className={`absolute w-8 h-8 transition-transform duration-300 ${
              open ? "-rotate-90 opacity-0" : "rotate-0 opacity-100"
            }`}
          />
        </div>
      </button>

      {/* Mobile Nav Overlay */}
      <div
        className={`fixed inset-0 z-[100] h-full w-full mt-20 transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        } lg:hidden`}
      >
        <div className="w-full h-full bg-gray-200">
          <div className="w-full flex flex-col items-center py-6 gap-4 text-black text-xl font-semibold">
            {NavbarConfig.map((item) => (
              <Link
                key={item.id}
                href={item.id}
                onClick={() => setOpen(false)}
                className="text-black font-[500] hover:bg-black/10 py-3 px-8 rounded-lg transition w-full text-center block"
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <Link
                href="/settings"
                onClick={() => setOpen(false)}
                className="text-black font-[500] hover:bg-black/10 py-3 px-8 rounded-lg transition w-full text-center block"
              >
                Profile
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="text-black font-[500] hover:bg-black/10 py-3 px-8 rounded-lg transition w-full text-center block"
              >
                Sign In
              </Link>
            )}
            <div className="w-full">
              <div className="pt-3 flex justify-center w-full">
                <GithubButton />
              </div>
              <div className="py-0 flex justify-center w-full">
                <YouTubeButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

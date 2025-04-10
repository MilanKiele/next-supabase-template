import Link from "next/link";
import { NavbarConfig, WebName } from "@/constants";
import GithubButton from "./GithubButton";
import YouTubeButton from "./YoutubeButton";
import { getUserSession } from "@/actions/auth/auth";
import MobileMenu from "./NavbarMobile";

export default async function Navbar() {
  const session = await getUserSession();
  const user = session?.user;

  return (
    <nav id="navbar" className="h-20">
      <div className="w-full fixed z-[100] bg-white px-6 shadow-md">
        <div className="h-20 mx-auto container flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <Link href="/" className="text-lg font-bold text-black">
              <p className="block antialiased font-sans text-black text-2xl font-bold tracking-tighter">
                {WebName}
              </p>
            </Link>
            <div className="hidden lg:flex ml-4 gap-4">
              <GithubButton />
              <YouTubeButton />
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-2">
            {NavbarConfig.map((item) => (
              <Link
                key={item.id}
                href={item.id}
                className="text-black font-[500] hover:bg-black/10 py-3 px-4 rounded-lg transition"
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <Link
                href="/settings"
                className="text-black border border-black font-semibold hover:bg-black hover:text-white py-2 px-4 rounded-md transition w-fit"
              >
                Profile
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-black border border-black font-semibold hover:bg-black hover:text-white py-2 px-4 rounded-md transition w-fit"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Toggle + Menu */}
          <div className="lg:hidden">
            <MobileMenu user={user ?? null} />
          </div>
        </div>
      </div>
    </nav>
  );
}

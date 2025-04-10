"use client";

import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { GithubLink } from "@/constants";

export default function GithubButton() {
  return (
    <Link
      href={GithubLink}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center text-yellow-200 hover:text-yellow-600 rounded transition py-2 px-4 bg-foreground"
    >
      <FaGithub className="text-sm mr-2" />
      GitHub
    </Link>
  );
}

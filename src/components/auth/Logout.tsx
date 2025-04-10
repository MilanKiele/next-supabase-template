"use client";

import { signOut } from "@/actions/auth/auth";
import React, { useState } from "react";

const Logout = () => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    await signOut(); // Call the sign out action

    setLoading(false);
  };

  return (
    <div className="bg-red-800 text-white text-sm px-4 py-2 rounded-md cursor-pointer">
      <form onSubmit={handleLogout}>
        <button
          type="submit"
          disabled={loading}
          className="w-full h-full text-center" // Ensure the button takes the full width and height
        >
          <div className="flex justify-center items-center w-full h-full">
            {loading ? "Signing out..." : "Sign out"}
          </div>
        </button>
      </form>
    </div>
  );
};

export default Logout;

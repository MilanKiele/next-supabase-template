"use client";

import { useEffect, useState } from "react";
import Logout from "./Logout";
import { getUserSession } from "@/actions/auth/auth";
import { User } from "@supabase/supabase-js";

export default function UserInfo() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await getUserSession();
      setUser(response?.user || null);
    };
    fetchUserData();
  }, []);

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-6 p-6 rounded-2xl shadow-md bg-white border border-gray-200">
        {/* Email Adress */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Logged in with</h2>
          <p className="text-md text-gray-500">Loading...</p>
        </div>

        {/* Logout-Button */}
        <div className="mb-6">
          <Logout />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-6 p-6 rounded-2xl shadow-md bg-white border border-gray-200">
      {/* Email Adress */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Logged in with</h2>
        {user ? <p className="text-md text-gray-500">{user.email}</p> : <></>}
      </div>

      {/* Logout-Button */}
      <div className="mb-6">
        <Logout />
      </div>
    </div>
  );
}

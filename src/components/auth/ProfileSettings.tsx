"use client";

import { getOwnProfile, updateUsername } from "@/actions/profile/profile";
import React, { useState, useEffect } from "react";
import ProfileData from "./ProfileData";
import { FaEdit } from "react-icons/fa";

type UserProfile = {
  id?: string;
  username: string | null;
  is_blocked?: boolean;
};

export default function ProfileSettings() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      const profileData = await getOwnProfile();
      if (profileData) {
        setUserProfile(profileData);
        setUsername(profileData.username || "");
      }
    };
    fetchUserProfile();
  }, []);

  const handleProfileUpdate = async () => {
    const result = await updateUsername(username);
    if (result.status === "success") {
      setProfileSuccess(result.message);
      setProfileError("");
    } else {
      setProfileError(result.message);
      setProfileSuccess("");
    }
  };

  if (!userProfile) {
    return (
      <div className="max-w-md mx-auto mt-6 p-6 rounded-2xl shadow-md bg-white border border-gray-200">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-6 p-6 rounded-2xl shadow-md bg-white border border-gray-200">
      <h3 className="text-md font-semibold mb-4">Profile Settings</h3>

      <ProfileData username={username} />

      <h3 className="text-md font-semibold mb-4 mt-8">Change Username</h3>
      <div className="mb-4 flex items-center">
        {isEditing ? (
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        ) : (
          <p className="text-sm text-gray-600">{username || "No username"}</p>
        )}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="ml-2 p-1 text-gray-600 hover:text-blue-500"
          aria-label="Edit username"
        >
          <FaEdit />
        </button>
      </div>

      {isEditing && (
        <button
          onClick={handleProfileUpdate}
          className="mt-2 px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      )}

      {profileSuccess && (
        <p className="text-green-600 text-sm mt-1">{profileSuccess}</p>
      )}
      {profileError && (
        <p className="text-red-600 text-sm mt-1">{profileError}</p>
      )}
    </div>
  );
}

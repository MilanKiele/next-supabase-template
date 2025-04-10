"use client";

import { getOwnProfile, updateUsername } from "@/actions/profile/profile";
import React, { useState, useEffect } from "react";
import ProfileData from "./ProfileData";
import { FaEdit } from "react-icons/fa";

export default function ProfileSettings() {
  const [userProfile, setUserProfile] = useState<any>(null); // User profile data
  const [isEditing, setIsEditing] = useState<boolean>(false); // Editing state for username
  const [username, setUsername] = useState<string>("");
  const [profileSuccess, setProfileSuccess] = useState<string>("");
  const [profileError, setProfileError] = useState<string>("");

  // Fetch the user's profile when the component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      // Fetch profile data from Supabase or another API
      const profileData = await getOwnProfile(); // Retrieve profile data
      if (profileData) {
        setUserProfile(profileData); // Store profile data
        setUsername(profileData.username || "");
      }
    };
    fetchUserProfile();
  }, []);

  // Function to update the profile data
  const handleProfileUpdate = async () => {
    try {
      const result = await updateUsername(username); // Update only the username
      if (result.status === "success") {
        // Username updated successfully
        setProfileSuccess(result.message);
        setProfileError("");
      } else {
        // Error occurred (e.g. the username was not unique)
        setProfileError(result.message);
        setProfileSuccess("");
      }
    } catch (error) {
      setProfileError("Error updating profile.");
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

      {/* ProfileData component for displaying the username */}
      <ProfileData username={username} />

      {/* Editable Username Field */}
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

      {/* Save Changes Button */}
      {isEditing && (
        <button
          onClick={handleProfileUpdate}
          className="mt-2 px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      )}

      {/* Success or Error Message */}
      {profileSuccess && (
        <p className="text-green-600 text-sm mt-1">{profileSuccess}</p>
      )}
      {profileError && (
        <p className="text-red-600 text-sm mt-1">{profileError}</p>
      )}
    </div>
  );
}

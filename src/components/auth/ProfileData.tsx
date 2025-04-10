import React from "react";

interface ProfileDataProps {
  username: string;
}

const ProfileData: React.FC<ProfileDataProps> = ({ username }) => {
  return (
    <div className="mb-4 flex items-center">
      <p className="text-sm text-gray-600">@{username || "No username"}</p>
    </div>
  );
};

export default ProfileData;

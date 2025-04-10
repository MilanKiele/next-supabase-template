"use client";

import React, { useState, useTransition, useEffect } from "react";
import {
  changeEmail,
  changePassword,
  getUserSession,
} from "@/actions/auth/auth";
import { FaEdit } from "react-icons/fa";
import { User } from "@supabase/supabase-js";

export default function UserEdit() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Declare a FormData object for both email and password
  const formData = new FormData();

  // Fetch user data from the server on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const response = await getUserSession();
      setUser(response?.user || null); // Assuming 'response?.user' contains user data
    };
    fetchUserData();
  }, []);

  const handleEmailChange = () => {
    startTransition(async () => {
      // Update formData with new email value
      formData.set("email", email);

      const res = await changeEmail(formData);
      if (res.status === "success") {
        setEmailSuccess("Email has been updated.");
        setEmailError("");
      } else {
        setEmailError(res.status);
        setEmailSuccess("");
      }
    });
  };

  const handlePasswordChange = () => {
    startTransition(async () => {
      // Update formData with new password value
      formData.set("password", password);

      const res = await changePassword(formData);
      if (res.status === "success") {
        setPasswordSuccess("Password has been updated.");
        setPasswordError("");
      } else {
        setPasswordError(res.status);
        setPasswordSuccess("");
      }
    });
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-6 p-6 rounded-2xl shadow-md bg-white border border-gray-200">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-6 p-6 rounded-2xl shadow-md bg-white border border-gray-200">
      {/* Change email */}
      <h3 className="text-md font-semibold mb-4">Change Email</h3>
      <div className="mb-4 flex items-center">
        {isEditingEmail ? (
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
            disabled={isPending}
          />
        ) : (
          <p className="text-sm text-gray-600">
            {user?.email || "youremail@example.com"}
          </p>
        )}
        <button
          onClick={() => setIsEditingEmail(!isEditingEmail)}
          className="ml-2 p-1 text-gray-600 hover:text-blue-500"
          aria-label="edit email"
        >
          <FaEdit />
        </button>
      </div>
      {isEditingEmail && (
        <button
          onClick={handleEmailChange}
          disabled={isPending}
          className="mt-2 px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
          aria-label="update email"
        >
          Update Email
        </button>
      )}
      {emailSuccess && (
        <p className="text-green-600 text-sm mt-1">{emailSuccess}</p>
      )}
      {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}

      {/* Change password */}
      <h3 className="text-md font-semibold mt-8 mb-4">Change Password</h3>
      <div className="mb-4 flex items-center">
        {isEditingPassword ? (
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
            disabled={isPending}
          />
        ) : (
          <p className="text-sm text-gray-600">*********</p>
        )}
        <button
          onClick={() => setIsEditingPassword(!isEditingPassword)}
          className="ml-2 p-1 text-gray-600 hover:text-blue-500"
          aria-label="update password"
        >
          <FaEdit />
        </button>
      </div>
      {isEditingPassword && (
        <button
          onClick={handlePasswordChange}
          disabled={isPending}
          className="mt-2 px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
          aria-label="edit password"
        >
          Update Password
        </button>
      )}
      {passwordSuccess && (
        <p className="text-green-600 text-sm mt-1">{passwordSuccess}</p>
      )}
      {passwordError && (
        <p className="text-red-600 text-sm mt-1">{passwordError}</p>
      )}
    </div>
  );
}

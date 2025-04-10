"use client";

import { useEffect, useState, useTransition } from "react";
import {
  getAllUsers,
  setUserRole,
  toggleBlockUser,
} from "@/actions/admin/admin";
import { getUserRole } from "@/actions/profile/profile";

type UserProfile = {
  user_id: string;
  email: string;
  role: string;
  is_blocked: boolean;
  username: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const [userRole, allUsers] = await Promise.all([
        getUserRole(),
        getAllUsers(),
      ]);

      if (userRole !== "admin") {
        setRole("not-admin");
        return;
      }

      setRole("admin");
      if (Array.isArray(allUsers)) {
        setUsers(allUsers);
      } else {
        console.error("Failed to fetch users:", allUsers.message);
      }
    }

    load();
  }, []);

  const filteredUsers = users.filter((u) => {
    const lowerSearch = search.toLowerCase();
    return (
      u.email.toLowerCase().includes(lowerSearch) ||
      u.username?.toLowerCase().includes(lowerSearch)
    );
  });

  const handleToggleRole = (user: UserProfile) => {
    startTransition(async () => {
      const newRole = user.role === "admin" ? "user" : "admin";
      const res = await setUserRole(user.user_id, newRole);

      if (res.status === "success") {
        setUsers((prev) =>
          prev.map((u) =>
            u.user_id === user.user_id ? { ...u, role: newRole } : u
          )
        );
      }
    });
  };

  const handleToggleBlock = (user: UserProfile) => {
    startTransition(async () => {
      const res = await toggleBlockUser(user.user_id, !user.is_blocked);
      if (res.status === "success") {
        setUsers((prev) =>
          prev.map((u) =>
            u.user_id === user.user_id ? { ...u, is_blocked: !u.is_blocked } : u
          )
        );
      }
    });
  };

  if (role === "not-admin") {
    return (
      <main className="flex justify-center items-center h-[80vh] text-gray-600">
        <p>You do not have permission to view this page.</p>
      </main>
    );
  }

  return (
    <main>
      <div className="max-w-3xl mx-auto mt-12 px-4">
        <h1 className="text-2xl font-bold mb-6">User Management</h1>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email or username..."
          className="w-full border px-4 py-2 rounded mb-6"
        />

        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div
              key={user.user_id}
              className="border px-4 py-3 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{user.email}</p>
                {user.username && (
                  <p className="text-sm text-gray-500">@{user.username}</p>
                )}

                <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                  <span className="capitalize">Role: {user.role}</span>
                  {user.role === "admin" && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">
                      Admin
                    </span>
                  )}
                  {user.role === "user" && (
                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
                      User
                    </span>
                  )}
                  {user.is_blocked && (
                    <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs">
                      Blocked
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 items-end">
                <button
                  onClick={() => handleToggleBlock(user)}
                  className="text-sm px-3 py-1 border rounded hover:bg-gray-100"
                  disabled={isPending}
                >
                  {user.is_blocked ? "Unblock" : "Block"}
                </button>
                <button
                  onClick={() => handleToggleRole(user)}
                  className="text-sm px-3 py-1 border rounded hover:bg-gray-100"
                  disabled={isPending}
                >
                  {user.role === "admin" ? "Demote" : "Promote to Admin"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

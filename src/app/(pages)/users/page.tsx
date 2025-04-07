"use client";

import { useEffect, useState, useTransition } from "react";
import { toggleBlockUser } from "@/actions/admin/admin";
import { getUserRole } from "@/actions/roles/roles";
import { getAllUsers } from "@/actions/users/users";

type UserProfile = {
  user_id: string;
  email: string;
  role: string;
  is_blocked: boolean;
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
      setUsers(allUsers);
    }

    load();
  }, []);

  const filteredUsers = users.filter((u) =>
    `${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

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
    return <p className="text-center mt-12">Access denied. Admins only.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-12 px-4">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by email..."
        className="w-full border px-4 py-2 rounded mb-6"
      />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-2">All Users</h2>
        {filteredUsers.map((user) => (
          <div
            key={user.user_id}
            className="border px-4 py-3 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{user.email}</p>
              <p className="text-sm text-gray-600 capitalize">
                Role: {user.role}
              </p>
              {user.is_blocked && (
                <span className="text-red-500 text-sm">Blocked</span>
              )}
            </div>
            <button
              onClick={() => handleToggleBlock(user)}
              className="text-sm px-3 py-1 border rounded hover:bg-gray-100"
              disabled={isPending}
            >
              {user.is_blocked ? "Unblock" : "Block"}
            </button>
          </div>
        ))}
      </div>

      <hr className="my-8" />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-2">Blocked Users</h2>
        {users.filter((u) => u.is_blocked).length === 0 && (
          <p className="text-sm text-gray-500">No blocked users.</p>
        )}
        {users
          .filter((u) => u.is_blocked)
          .map((user) => (
            <div
              key={user.user_id}
              className="border px-4 py-3 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{user.email}</p>
                <p className="text-sm text-gray-600 capitalize">
                  Role: {user.role}
                </p>
                <span className="text-red-500 text-sm">Blocked</span>
              </div>
              <button
                onClick={() => handleToggleBlock(user)}
                className="text-sm px-3 py-1 border rounded hover:bg-gray-100"
                disabled={isPending}
              >
                Unblock
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

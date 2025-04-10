"use client";

import CreatePostForm from "@/components/posts/CreatePostForm";
import {
  getAllPosts,
  deleteOwnPost,
  updateOwnPost,
} from "@/actions/posts/posts";
import { deletePostAsAdmin } from "@/actions/admin/admin";
import { useEffect, useState, useTransition } from "react";
import { getOwnProfileId, getUserRole } from "@/actions/profile/profile";

type Post = {
  id: number;
  title: string;
  content: string;
  profile_id: string;
  created_at: string;
  username: string; // Hier fügen wir den Username hinzu
};

export default function PostsSection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [ownProfileId, setOwnProfileId] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");
  const [editContent, setEditContent] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [userRole, setUserRole] = useState<string | null>(null);

  // Lade Posts und andere Daten
  useEffect(() => {
    async function loadData() {
      const [postsRes, profileId, role] = await Promise.all([
        getAllPosts(),
        getOwnProfileId(),
        getUserRole(),
      ]);

      if (postsRes.status === "success") {
        // Falls postsRes.posts undefined ist, wird ein leeres Array gesetzt
        setPosts(postsRes.posts ?? []);
      } else {
        setStatus(postsRes.message ?? null);
      }

      setOwnProfileId(profileId);
      setUserRole(role);
      setLoading(false);
    }

    loadData();
  }, []);

  const handleDelete = (id: number, isOwner: boolean) => {
    startTransition(async () => {
      const res = isOwner
        ? await deleteOwnPost(id)
        : await deletePostAsAdmin(id);

      if (res.status === "success") {
        setPosts((prev) => prev.filter((post) => post.id !== id));
      } else {
        setStatus(res.message ?? null);
      }
    });
  };

  const startEditing = (post: Post) => {
    setEditingPostId(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  const cancelEditing = () => {
    setEditingPostId(null);
    setEditTitle("");
    setEditContent("");
  };

  const handleUpdate = () => {
    if (!editingPostId) return;

    startTransition(async () => {
      const res = await updateOwnPost(editingPostId, editTitle, editContent);
      if (res.status === "success") {
        setPosts((prev) =>
          prev.map((post) =>
            post.id === editingPostId
              ? { ...post, title: editTitle, content: editContent }
              : post
          )
        );
        cancelEditing();
      } else {
        setStatus(res.message ?? null);
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 px-4">
      <h1 className="text-2xl font-semibold mb-4">Neuen Post erstellen</h1>
      <CreatePostForm />

      <hr className="my-8" />

      <h2 className="text-xl font-semibold mb-4">Alle Beiträge</h2>
      {status && <p className="text-red-500 mb-2">{status}</p>}
      {loading ? (
        <p>Lade Beiträge...</p>
      ) : (
        posts.map((post) => {
          const isEditing = editingPostId === post.id;
          const isOwner = ownProfileId === post.profile_id;

          return (
            <div key={post.id} className="border p-4 rounded mb-4">
              {isEditing ? (
                <>
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full border px-3 py-1 rounded mb-2"
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={4}
                    className="w-full border px-3 py-1 rounded mb-2"
                  />
                  <div className="flex gap-4">
                    <button
                      onClick={handleUpdate}
                      className="text-sm text-green-600 hover:underline"
                      disabled={isPending}
                    >
                      {isPending ? "Speichert..." : "Speichern"}
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="text-sm text-gray-600 hover:underline"
                    >
                      Abbrechen
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-semibold text-lg">{post.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {new Date(post.created_at).toLocaleString()}
                    {post.username && (
                      <>
                        {" "}
                        · <span className="text-blue-600">{post.username}</span>
                      </>
                    )}
                  </p>
                  <p>{post.content}</p>
                  {(isOwner || userRole === "admin") && (
                    <div className="flex gap-4 mt-2">
                      <button
                        onClick={() => startEditing(post)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Bearbeiten
                      </button>
                      <button
                        onClick={() => handleDelete(post.id, isOwner)}
                        className="text-sm text-red-800 hover:underline"
                        disabled={isPending}
                      >
                        {isPending ? "Lösche..." : "Löschen"}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

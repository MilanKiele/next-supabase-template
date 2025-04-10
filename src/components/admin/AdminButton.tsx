import { getUserSession } from "@/actions/auth/auth";
import { getOwnProfileRole } from "@/actions/profile/profile";
import Link from "next/link";

export default async function AdminButton() {
  const response = await getUserSession();
  const role = await getOwnProfileRole();

  if (!response?.user) {
    return <></>;
  }

  if (role !== "admin") {
    return <></>;
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-lg font-bold">Admin</p>
      <div className="text-white text-sm px-4 py-2 rounded-md cursor-pointer ml-0 pl-0">
        <Link
          href="/users"
          className="text-black border border-black font-semibold hover:bg-black hover:text-white py-2 px-4 rounded-md transition w-fit"
        >
          User Management
        </Link>
      </div>
    </div>
  );
}

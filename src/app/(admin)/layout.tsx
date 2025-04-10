import { getUserSession } from "@/actions/auth/auth";
import { getOwnProfileRole } from "@/actions/profile/profile";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const response = await getUserSession();
  const role = await getOwnProfileRole();

  if (!response?.user) {
    redirect("/");
  }

  if (role !== "admin") {
    redirect("/");
  }

  return <>{children}</>;
}

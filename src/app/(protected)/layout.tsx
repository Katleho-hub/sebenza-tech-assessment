import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Navbar } from "@/app/(protected)/components/navigation-bar";
import { decrypt } from "@/lib/server/session";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    redirect("/login");
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

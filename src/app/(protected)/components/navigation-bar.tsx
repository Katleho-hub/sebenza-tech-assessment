import { LogoutButton } from "@/app/(auth)/components/logout-button";
import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/server/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function Navbar() {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(session.userId) },
    select: { username: true, createdAt: true, balance: true },
  });

  return (
    <div className="flex justify-between items-center bg-warning w-full p-4">
      {user && <span className="text-2xl font-bold">{user.username}</span>}
      <LogoutButton />
    </div>
  );
}

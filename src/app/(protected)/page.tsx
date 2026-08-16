import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BalanceDisplay } from "@/app/(protected)/components/balance-display";
import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/server/session";
import { Bundles } from "./components/bundles";

export default async function Page() {
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
    <>
      <Link href="/transactions" className="btn btn-md w-fit btn-info">
        View Transactions
      </Link>
      <BalanceDisplay userBalance={user?.balance ?? 0} />
      <Bundles userBalance={user?.balance ?? 0} />
    </>
  );
}

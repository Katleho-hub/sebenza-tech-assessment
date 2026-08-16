import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { BackButton } from "@/app/(protected)/components/back-button";
import { TransactionsTable } from "@/app/(protected)/transactions/transactions-table";
import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/server/session";

export default async function Page() {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    redirect("/login");
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: Number(session.userId),
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="flex h-[calc(100dvh-6rem)] min-h-0 flex-col gap-4 overflow-hidden">
      <BackButton />
      <TransactionsTable transactions={transactions} />
    </div>
  );
}

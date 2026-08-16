import { BackButton } from "@/app/(protected)/components/back-button";
import { TransactionsTable } from "@/app/(protected)/transactions/transactions-table";

export default function Page() {
  return (
    <div className="flex h-[calc(100dvh-6rem)] min-h-0 flex-col gap-4 overflow-hidden">
      <BackButton />
      <TransactionsTable />
    </div>
  );
}

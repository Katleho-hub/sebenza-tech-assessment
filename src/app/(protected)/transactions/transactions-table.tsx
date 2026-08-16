"use client";
import type { Transaction } from "@prisma/client";
import { useEffect, useState } from "react";

export function TransactionsTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetch("/api/transactions")
      .then((res) => res.json())
      .then(({ data }) => {
        setTransactions(data);
      });
  }, []);

  return (
    <div className="min-h-0 flex-1 overflow-auto">
      <table className="table table-zebra table-pin-rows">
        <thead>
          <tr>
            <th>Bundle Name</th>
            <th>Cost</th>
            <th>Date Redeemed</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <th>{transaction.description}</th>
              <td>
                {transaction.type === "CREDIT" ? "" : "-"}
                {transaction.amount}
              </td>
              <td>{transaction.createdAt.toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

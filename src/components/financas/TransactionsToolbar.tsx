"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TransactionForm } from "@/components/financas/TransactionForm";
import type { Account, Category } from "@/lib/types";

export function TransactionsToolbar({ accounts, categories }: { accounts: Account[]; categories: Category[] }) {
  const [open, setOpen] = useState(false);

  if (accounts.length === 0) {
    return <p className="text-sm text-slate-400">Cadastre uma conta antes de lançar transações.</p>;
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>+ Novo lançamento</Button>
      {open && <TransactionForm accounts={accounts} categories={categories} onClose={() => setOpen(false)} />}
    </>
  );
}

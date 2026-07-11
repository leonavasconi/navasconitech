"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { RecurringForm } from "@/components/financas/RecurringForm";
import type { Account, Category } from "@/lib/types";

export function RecurringToolbar({ accounts, categories }: { accounts: Account[]; categories: Category[] }) {
  const [open, setOpen] = useState(false);

  if (accounts.length === 0) {
    return <p className="text-sm text-slate-400">Cadastre uma conta antes de criar contas recorrentes.</p>;
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>+ Nova recorrência</Button>
      {open && <RecurringForm accounts={accounts} categories={categories} onClose={() => setOpen(false)} />}
    </>
  );
}

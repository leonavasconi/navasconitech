"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { AccountForm } from "@/components/financas/AccountForm";

export function AccountsToolbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>+ Nova conta</Button>
      {open && <AccountForm onClose={() => setOpen(false)} />}
    </>
  );
}

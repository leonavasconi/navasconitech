"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { GoalForm } from "@/components/financas/GoalForm";

export function GoalsToolbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>+ Nova meta</Button>
      {open && <GoalForm onClose={() => setOpen(false)} />}
    </>
  );
}

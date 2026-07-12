"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { simulatePayment } from "@/app/marketplace/checkout/actions";

export function SimulatePaymentButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await simulatePayment(orderId);
          router.refresh();
        })
      }
    >
      {isPending ? "Confirmando..." : "Simular pagamento aprovado"}
    </Button>
  );
}

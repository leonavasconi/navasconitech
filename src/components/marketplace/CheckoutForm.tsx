"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { createOrder } from "@/app/marketplace/checkout/actions";
import { formatCurrency } from "@/lib/financas/format";
import { validateCoupon } from "@/app/marketplace/actions";

interface AddressFormValues {
  name: string;
  phone: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
}

const SHIPPING_FLAT_RATE = 19.9;

export function CheckoutForm({ subtotal }: { subtotal: number }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [checkingCoupon, setCheckingCoupon] = useState(false);
  const [paymentProvider, setPaymentProvider] = useState<"mercado_pago" | "stripe" | "pix">("pix");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormValues>();

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCheckingCoupon(true);
    setCouponMessage(null);
    try {
      const coupon = await validateCoupon(couponCode.trim());
      const value =
        coupon.discount_type === "percent" ? (subtotal * coupon.discount_value) / 100 : coupon.discount_value;
      setDiscount(Math.min(value, subtotal));
      setCouponMessage("Cupom aplicado!");
    } catch (err) {
      setDiscount(0);
      setCouponMessage(err instanceof Error ? err.message : "Cupom inválido");
    } finally {
      setCheckingCoupon(false);
    }
  };

  const onSubmit = async (address: AddressFormValues) => {
    setServerError(null);
    try {
      const { orderId } = await createOrder({
        address,
        couponCode: couponCode.trim() || undefined,
        paymentProvider,
      });
      router.push(`/marketplace/pedido/${orderId}`);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Erro ao finalizar o pedido");
    }
  };

  const total = Math.max(0, subtotal - discount) + SHIPPING_FLAT_RATE;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <form className="space-y-4 lg:col-span-2" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="font-semibold text-slate-900">Endereço de entrega</h2>

        <Input label="Nome completo" {...register("name", { required: true })} error={errors.name && "Obrigatório"} />
        <Input label="Telefone" {...register("phone", { required: true })} error={errors.phone && "Obrigatório"} />

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <Input label="Rua" {...register("street", { required: true })} error={errors.street && "Obrigatório"} />
          </div>
          <Input label="Número" {...register("number", { required: true })} error={errors.number && "Obrigatório"} />
        </div>

        <Input label="Complemento (opcional)" {...register("complement")} />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Bairro"
            {...register("neighborhood", { required: true })}
            error={errors.neighborhood && "Obrigatório"}
          />
          <Input label="CEP" {...register("zip", { required: true })} error={errors.zip && "Obrigatório"} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input label="Cidade" {...register("city", { required: true })} error={errors.city && "Obrigatório"} />
          <Input label="Estado" {...register("state", { required: true })} error={errors.state && "Obrigatório"} />
        </div>

        <h2 className="pt-2 font-semibold text-slate-900">Pagamento (sandbox)</h2>
        <p className="text-xs text-slate-400">
          Ambiente de testes — nenhuma cobrança real é feita. Escolha um método para simular o pagamento.
        </p>
        <Select label="Método de pagamento" value={paymentProvider} onChange={(e) => setPaymentProvider(e.target.value as typeof paymentProvider)}>
          <option value="pix">Pix</option>
          <option value="mercado_pago">Mercado Pago</option>
          <option value="stripe">Cartão (Stripe)</option>
        </Select>

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Processando..." : "Confirmar pedido"}
        </Button>
      </form>

      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold text-slate-900">Resumo</h2>

        <div className="flex gap-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Cupom de desconto"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/40"
          />
          <button
            type="button"
            disabled={checkingCoupon}
            onClick={applyCoupon}
            className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            Aplicar
          </button>
        </div>
        {couponMessage && <p className="text-xs text-slate-500">{couponMessage}</p>}

        <div className="space-y-2 border-t border-slate-100 pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Desconto</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-slate-500">Frete</span>
            <span>{formatCurrency(SHIPPING_FLAT_RATE)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-100 pt-2 font-semibold text-slate-900">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatCurrency } from "@/lib/financas/format";

interface Slice {
  name: string;
  value: number;
  color: string;
}

export function CategoryPieChart({ data }: { data: Slice[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-400">
        Sem despesas registradas neste mês ainda.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={2}>
          {data.map((slice) => (
            <Cell key={slice.name} fill={slice.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

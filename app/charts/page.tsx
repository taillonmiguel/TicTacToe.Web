"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell as PieCell,
  Legend,
} from "recharts";

import { Card } from "@/components/ui/Card";
import { getRanking } from "@/lib/api";

const pieColors = [
  "hsl(var(--foreground))",
  "hsl(var(--foreground) / 0.8)",
  "hsl(var(--foreground) / 0.6)",
  "hsl(var(--foreground) / 0.4)",
  "hsl(var(--foreground) / 0.3)",
];

export default function ChartsPage() {
  const query = useQuery({
    queryKey: ["ranking", "charts"],
    queryFn: async () => getRanking(10),
    staleTime: 5000,
  });

  const data = useMemo(() => {
    return (query.data ?? []).map((r) => ({
      jogador: r.jogador,
      vitorias: r.vitorias,
    }));
  }, [query.data]);

  return (
    <div className="min-h-screen">
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-4 px-4 py-8">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-lg font-semibold">Gráficos</div>
              <div className="mt-1 text-sm opacity-80">
                Vitórias por jogador
              </div>
            </div>
            <Link className="underline opacity-90 hover:opacity-100" href="/">
              Voltar
            </Link>
          </div>
        </Card>

        <Card>
          {query.isLoading ? (
            <div className="text-sm opacity-80">Carregando...</div>
          ) : query.isError ? (
            <div className="text-sm opacity-80">
              Erro: {query.error instanceof Error ? query.error.message : "-"}
            </div>
          ) : !data.length ? (
            <div className="text-sm opacity-80">Sem dados.</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="h-[280px]">
                <div className="mb-2 text-sm font-medium">Bar</div>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ left: 8, right: 8 }}>
                    <CartesianGrid stroke="hsl(var(--foreground) / 0.1)" />
                    <XAxis dataKey="jogador" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="vitorias" fill="hsl(var(--foreground))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="h-[280px]">
                <div className="mb-2 text-sm font-medium">Pie</div>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      dataKey="vitorias"
                      nameKey="jogador"
                      outerRadius={90}
                    >
                      {data.map((_, idx) => (
                        <PieCell
                          key={idx}
                          fill={pieColors[idx % pieColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}

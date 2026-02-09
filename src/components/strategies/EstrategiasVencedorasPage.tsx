"use client";

import Link from "next/link";

import { useEstrategiasVitoriosas } from "@/hooks/useEstrategiasVitoriosas";
import { GraficoBarrasEstrategias } from "@/components/strategies/GraficoBarrasEstrategias";
import { ListaEstrategias } from "@/components/strategies/ListaEstrategias";
import { Card } from "@/components/ui/Card";

export function EstrategiasVencedorasPage() {
  const { query, data } = useEstrategiasVitoriosas(10);

  return (
    <div className="min-h-screen">
      <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-4 px-4 py-8">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-lg font-semibold">
                Estratégias Vencedoras
              </div>
              <div className="mt-1 text-sm opacity-80">
                Quais estratégias resultaram mais vitórias
              </div>
            </div>
            <Link className="underline opacity-90 hover:opacity-100" href="/">
              Voltar
            </Link>
          </div>
        </Card>

        <Card>
          {query.isLoading ? (
            <div className="space-y-3">
              <div className="h-4 w-40 rounded bg-black/5" />
              <div className="h-20 w-full rounded bg-black/5" />
              <div className="h-20 w-full rounded bg-black/5" />
            </div>
          ) : query.isError ? (
            <div className="text-sm opacity-80">
              Não foi possível carregar as estratégias.
              <div className="mt-1 text-xs opacity-70">
                {query.error instanceof Error ? query.error.message : "-"}
              </div>
            </div>
          ) : !data || data.totalVitorias <= 0 || data.itens.length === 0 ? (
            <div className="text-sm opacity-80">
              Sem dados (0 vitórias analisadas).
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="text-sm">
                Total de vitórias analisadas:{" "}
                <span className="font-semibold">{data.totalVitorias}</span>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <ListaEstrategias itens={data.itens} />
                <GraficoBarrasEstrategias itens={data.itens} />
              </div>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}

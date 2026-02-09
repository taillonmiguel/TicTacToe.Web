"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { Card } from "@/components/ui/Card";
import { getRanking } from "@/lib/api";

export default function RankingPage() {
  const query = useQuery({
    queryKey: ["ranking"],
    queryFn: async () => getRanking(10),
    staleTime: 5000,
  });

  return (
    <div className="min-h-screen">
      <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-4 px-4 py-8">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-lg font-semibold">Ranking</div>
              <div className="mt-1 text-sm opacity-80">Top 10 por vitórias</div>
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
          ) : !query.data?.length ? (
            <div className="text-sm opacity-80">Sem dados.</div>
          ) : (
            <div className="flex flex-col gap-2">
              {query.data.map((r, idx) => (
                <div
                  key={`${r.jogador}-${idx}`}
                  className="flex items-center justify-between rounded-lg border border-foreground/10 px-3 py-2"
                >
                  <div className="text-sm font-medium">
                    {idx + 1}. {r.jogador}
                  </div>
                  <div className="text-sm opacity-80">{r.vitorias}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}

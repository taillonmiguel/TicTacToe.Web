"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { Card } from "@/components/ui/Card";
import { getHistory } from "@/lib/api";

export default function HistoryPage() {
  const query = useQuery({
    queryKey: ["history"],
    queryFn: async () => getHistory(50),
    staleTime: 2000,
  });

  return (
    <div className="min-h-screen">
      <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-4 px-4 py-8">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-lg font-semibold">Histórico</div>
              <div className="mt-1 text-sm opacity-80">Últimas 50 partidas</div>
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
            <div className="text-sm opacity-80">Sem partidas.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {query.data.map((g: any) => {
                const id = String(g?.id ?? g?.Id ?? "");
                const jogadorX = String(g?.jogadorX ?? g?.JogadorX ?? "-");
                const jogadorO = String(g?.jogadorO ?? g?.JogadorO ?? "-");
                const vencedor = String(g?.vencedor ?? g?.Vencedor ?? "");
                const finalizadoEm = String(
                  g?.finalizadoEm ?? g?.FinalizadoEm ?? "",
                );

                return (
                  <div
                    key={id}
                    className="rounded-lg border border-foreground/10 p-3"
                  >
                    <div className="text-sm font-medium">
                      <span className="opacity-80">Game:</span>{" "}
                      <span
                        className="inline-block max-w-full break-all"
                        title={id}
                      >
                        {id}
                      </span>
                    </div>
                    <div className="mt-1 text-sm opacity-80">
                      X: {jogadorX} · O: {jogadorO}
                    </div>
                    <div className="mt-1 text-sm">
                      {vencedor ? (
                        <span className="font-medium">
                          Vencedor: {vencedor}
                        </span>
                      ) : (
                        <span className="opacity-80">Sem vencedor</span>
                      )}
                    </div>
                    {finalizadoEm ? (
                      <div className="mt-1 text-xs opacity-70">
                        {finalizadoEm}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}

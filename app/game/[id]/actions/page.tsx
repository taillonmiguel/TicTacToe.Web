"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Card } from "@/components/ui/Card";
import { getActions } from "@/lib/api";

export default function GameActionsPage() {
  const params = useParams<{ id: string }>();
  const gameId = params.id;

  const query = useQuery({
    queryKey: ["actions", gameId],
    queryFn: async () => getActions(gameId, 200),
    staleTime: 1000,
  });

  return (
    <div className="min-h-screen">
      <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-4 px-4 py-8">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-lg font-semibold">Ações / Logs</div>
              <div className="mt-1 text-sm opacity-80">Game: {gameId}</div>
            </div>
            <Link
              className="underline opacity-90 hover:opacity-100"
              href={`/game/${gameId}`}
            >
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
            <div className="text-sm opacity-80">Sem ações.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {query.data.map((a) => (
                <div
                  key={a.id}
                  className="rounded-lg border border-foreground/10 p-3"
                >
                  <div className="text-sm font-medium">{a.tipo}</div>
                  <div className="mt-1 text-xs opacity-70">{a.dataHora}</div>
                  <div className="mt-2 text-sm">
                    {a.jogador ? (
                      <span className="font-medium">{a.jogador}</span>
                    ) : null}
                    {a.posicao !== undefined ? (
                      <span className="opacity-80"> · posição {a.posicao}</span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}

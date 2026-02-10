"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import { Board } from "@/components/game/Board";
import { GameResultOverlay } from "@/components/game/GameResultOverlay";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useGame } from "@/hooks/useGame";
import { isFinished } from "@/lib/gameModel";
import { calcularLinhaVencedora, getMensagemFinal } from "@/lib/gameResult";
import { useAppStore } from "@/store/appStore";

export default function GamePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const gameId = params.id;

  const nickname = useAppStore((s) => s.nickname);
  const clearMatch = useAppStore((s) => s.clearMatch);

  const {
    game,
    query,
    sendMove,
    finished,
    inProgress,
    yourTurn,
    seuSimbolo,
    jogadorX,
    jogadorO,
    connectionStatus,
  } = useGame(gameId);

  useEffect(() => {
    if (!nickname) router.replace("/");
  }, [nickname, router]);

  const turnoLabel = useMemo(() => {
    if (!game) return "-";
    const raw = String(game.turnoAtualRaw ?? "");
    return raw || "-";
  }, [game]);

  const resultLabel = useMemo(() => {
    if (!game) return null;
    if (!isFinished(game.statusRaw, game.finalizadoEm)) return null;

    const vencedor = game.vencedor ? String(game.vencedor) : "";
    if (vencedor) return `Vencedor: ${vencedor}`;

    const resultado = String(game.resultadoRaw ?? "");
    return resultado ? `Resultado: ${resultado}` : "Partida finalizada";
  }, [game]);

  const canPlay = Boolean(game) && inProgress && yourTurn;
  const turnoRaw = useMemo(() => {
    if (!game) return "";
    return String(game.turnoAtualRaw ?? "");
  }, [game]);

  const turnoSymbol = useMemo(() => {
    const upper = turnoRaw.trim().toUpperCase();
    if (upper === "X" || upper === "O") return upper;
    const label = String(turnoLabel ?? "")
      .trim()
      .toUpperCase();
    if (label === "X" || label === "O") return label;
    return "-";
  }, [turnoLabel, turnoRaw]);

  const xAtivo = turnoSymbol === "X";
  const oAtivo = turnoSymbol === "O";

  const meuNickname = useMemo(() => {
    if (nickname) return nickname;
    try {
      return localStorage.getItem("tictactoe:nickname") ?? "";
    } catch {
      return "";
    }
  }, [nickname]);

  const mensagemFinal = useMemo(() => {
    if (!game) return null;
    return getMensagemFinal({
      status: game.statusRaw,
      resultado: game.resultadoRaw,
      vencedor: game.vencedor,
      meuNickname,
    });
  }, [game, meuNickname]);

  const showOverlay = Boolean(mensagemFinal);
  const isDraw = mensagemFinal?.kind === "draw";
  const isAnyWin =
    mensagemFinal?.kind === "win" || mensagemFinal?.kind === "lose";

  const linhaVencedora = useMemo(() => {
    if (!game) return null;
    if (!finished) return null;
    if (!isAnyWin) return null;
    return calcularLinhaVencedora(game.board);
  }, [finished, game, isAnyWin]);

  return (
    <div className="min-h-screen">
      <main className="mx-auto w-full max-w-5xl px-4 pt-8 pb-10 md:pt-10 lg:pt-12">
        {!game ? (
          <div className="containerCard p-6 text-sm opacity-80">
            {query.isLoading ? "Carregando jogo..." : "Sem dados do jogo."}
          </div>
        ) : (
          <div>
            <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-foreground/10 bg-white/80 px-4 py-3 text-sm shadow-sm lg:hidden">
              <Link className="underline opacity-90 hover:opacity-100" href="/">
                Voltar
              </Link>
              <div className="text-xs opacity-70">
                Conexão: {connectionStatus}
              </div>
            </div>

            <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[260px_1fr] lg:gap-6">
              <aside className="rounded-2xl border border-foreground/10 bg-white/80 p-4 shadow-sm">
                <div className="hidden flex-col gap-2 text-sm leading-6 lg:flex">
                  <Link
                    className="underline opacity-90 hover:opacity-100"
                    href="/"
                  >
                    Voltar
                  </Link>
                  <div>Conexão: {connectionStatus}</div>
                </div>

                <div className="mt-3 flex flex-col gap-2 text-sm leading-6">
                  <div className="flex items-center gap-2">
                    <span className="opacity-80">Game:</span>
                    <span
                      className="max-w-[min(60vw,22rem)] truncate font-mono text-xs sm:text-sm lg:max-w-full"
                      title={gameId}
                    >
                      {gameId}
                    </span>
                  </div>

                  <div>
                    Você é{" "}
                    <span className="font-semibold">{seuSimbolo ?? "?"}</span>
                  </div>

                  <div>
                    É a vez de:{" "}
                    <span className="font-semibold">{turnoSymbol}</span>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div
                      className={[
                        "rounded-lg border border-foreground/10 px-3 py-2 text-sm",
                        xAtivo ? "ring-2 ring-foreground/30" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <div className="text-xs opacity-70">X</div>
                      <div className="font-medium">
                        {xAtivo ? (
                          <span className="marcaTexto">{jogadorX ?? "-"}</span>
                        ) : (
                          (jogadorX ?? "-")
                        )}
                      </div>
                    </div>
                    <div
                      className={[
                        "rounded-lg border border-foreground/10 px-3 py-2 text-sm",
                        oAtivo ? "ring-2 ring-foreground/30" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <div className="text-xs opacity-70">O</div>
                      <div className="font-medium">
                        {oAtivo ? (
                          <span className="marcaTexto">{jogadorO ?? "-"}</span>
                        ) : (
                          (jogadorO ?? "-")
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </aside>

              <section
                className={
                  "rounded-2xl border border-foreground/10 bg-white/70 p-4 shadow-sm sm:p-6"
                }
              >
                <h1 className="text-center text-[clamp(28px,6vw,44px)] font-extrabold tracking-tight">
                  Jogo da Velha
                </h1>

                <div
                  className={[
                    "mx-auto mt-4 w-full max-w-[min(92vw,420px)] aspect-square overflow-hidden rounded-2xl",
                    isAnyWin ? "ring-4 ring-green-500/25 animate-pulse" : "",
                    isDraw ? "grayscale opacity-70" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <Board
                    board={game.board}
                    canPlay={canPlay}
                    onPlay={async (pos) => {
                      await sendMove(pos);
                    }}
                    className="h-full w-full"
                    highlightIndices={linhaVencedora}
                  />
                </div>

                <div className="mt-5 flex flex-col gap-2 text-sm">
                  <div>
                    Status:{" "}
                    <span className="font-medium">
                      {String(game.statusRaw ?? "-")}
                    </span>
                  </div>
                  <div>
                    {finished
                      ? "Partida finalizada"
                      : canPlay
                        ? "Sua vez"
                        : "Aguardando o outro jogador"}
                  </div>
                  {resultLabel ? (
                    <div className="font-medium">{resultLabel}</div>
                  ) : null}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Link
                    className="underline opacity-90 hover:opacity-100"
                    href={`/game/${gameId}/actions`}
                  >
                    Ver Ações
                  </Link>

                  {finished ? (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        clearMatch();
                        router.push("/");
                      }}
                    >
                      Jogar novamente
                    </Button>
                  ) : null}
                </div>
              </section>
            </div>
          </div>
        )}
      </main>

      <GameResultOverlay
        open={showOverlay}
        kind={mensagemFinal?.kind ?? "draw"}
        title={mensagemFinal?.titulo ?? ""}
        description={mensagemFinal?.descricao ?? ""}
        onBack={() => {
          clearMatch();
          router.push("/");
        }}
        onReplay={() => {
          clearMatch();
          router.push("/");
        }}
      />
    </div>
  );
}

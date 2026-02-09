"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";

import { getGame, postMove } from "@/lib/api";
import {
  GameView,
  isFinished,
  isInProgress,
  isYourTurn,
  normalizeBoard,
} from "@/lib/gameModel";
import { useRealtime } from "@/hooks/useRealtime";
import { useAppStore } from "@/store/appStore";
import type { GameUpdatedEvent } from "@/types/game";
import { useToast } from "@/components/ui/toast/useToast";

function toGameViewFromDto(dto: any): GameView {
  return {
    id: String(dto?.id ?? dto?.Id ?? ""),
    jogadorX: String(dto?.jogadorX ?? dto?.JogadorX ?? ""),
    jogadorO: String(dto?.jogadorO ?? dto?.JogadorO ?? ""),
    board: normalizeBoard(
      dto?.tabuleiro ?? dto?.Tabuleiro ?? dto?.board ?? dto?.Board,
    ),
    turnoAtualRaw:
      dto?.turnoAtual ?? dto?.TurnoAtual ?? dto?.turno ?? dto?.Turno,
    statusRaw: dto?.status ?? dto?.Status,
    resultadoRaw: dto?.resultado ?? dto?.Resultado,
    vencedor: (dto?.vencedor ?? dto?.Vencedor ?? null) as any,
    finalizadoEm: (dto?.finalizadoEm ?? dto?.FinalizadoEm ?? null) as any,
  };
}

function toGameViewFromEvent(ev: GameUpdatedEvent): GameView {
  const anyEv: any = ev;
  return {
    id: String(anyEv.gameId ?? anyEv.GameId ?? ""),
    jogadorX: String(anyEv.jogadorX ?? anyEv.JogadorX ?? ""),
    jogadorO: String(anyEv.jogadorO ?? anyEv.JogadorO ?? ""),
    board: normalizeBoard(anyEv.board ?? anyEv.Board),
    turnoAtualRaw: anyEv.turnoAtual ?? anyEv.TurnoAtual,
    statusRaw: anyEv.status ?? anyEv.Status,
    resultadoRaw: anyEv.resultado ?? anyEv.Resultado,
    vencedor: (anyEv.vencedor ?? anyEv.Vencedor ?? null) as any,
    finalizadoEm: (anyEv.finalizadoEm ?? anyEv.FinalizadoEm ?? null) as any,
  };
}

export function useGame(gameId: string) {
  const toast = useToast();
  const realtime = useRealtime();

  const nickname = useAppStore((s) => s.nickname);
  const seuSimbolo = useAppStore((s) => s.seuSimbolo);
  const jogadorX = useAppStore((s) => s.jogadorX);
  const jogadorO = useAppStore((s) => s.jogadorO);

  const query = useQuery({
    queryKey: ["game", gameId],
    queryFn: async () => getGame(gameId),
    staleTime: 1000,
  });

  const [liveGame, setLiveGame] = useState<GameView | null>(null);

  useEffect(() => {
    const unsub = realtime.onGameUpdated((p) => {
      const view = toGameViewFromEvent(p);
      if (view.id !== gameId) return;
      setLiveGame(view);
    });
    return unsub;
  }, [gameId, realtime]);

  const game: GameView | null = useMemo(() => {
    if (liveGame) return liveGame;
    if (query.data) return toGameViewFromDto(query.data);
    return null;
  }, [liveGame, query.data]);

  const finished = game ? isFinished(game.statusRaw, game.finalizadoEm) : false;
  const inProgress = game
    ? isInProgress(game.statusRaw, game.finalizadoEm)
    : false;

  const yourTurn = game
    ? isYourTurn({
        turnoAtual: game.turnoAtualRaw,
        nickname,
        seuSimbolo,
        jogadorX: game.jogadorX,
        jogadorO: game.jogadorO,
      })
    : false;

  const moveMutation = useMutation({
    mutationFn: async (posicao: number) => {
      if (!nickname) throw new Error("Nickname não definido.");
      return await postMove({ id: gameId, nickname, posicao });
    },
    onError: (err) => {
      toast.show({
        type: "error",
        message: err instanceof Error ? err.message : "Erro ao enviar jogada",
      });
    },
  });

  const sendMove = useCallback(
    async (posicao: number) => {
      if (!game) return;
      if (finished) return;
      if (!inProgress) return;
      if (!yourTurn) return;

      const cell = game.board[posicao];
      if (cell) return;

      await moveMutation.mutateAsync(posicao);
    },
    [finished, game, inProgress, moveMutation, yourTurn],
  );

  return {
    game,
    query,
    sendMove,
    sendingMove: moveMutation.isPending,
    finished,
    inProgress,
    yourTurn,
    nickname,
    seuSimbolo,
    jogadorX: jogadorX ?? game?.jogadorX,
    jogadorO: jogadorO ?? game?.jogadorO,
    connectionStatus: realtime.status,
  };
}

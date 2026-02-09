"use client";

import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

import { joinMatchmaking, leaveMatchmaking } from "@/lib/api";
import { useRealtime } from "@/hooks/useRealtime";
import { useAppStore } from "@/store/appStore";
import type { MatchFoundEvent, MatchJoinResult } from "@/types/matchmaking";
import { useToast } from "@/components/ui/toast/useToast";

function coerceMatchFound(input: unknown): MatchFoundEvent | null {
  if (!input || typeof input !== "object") return null;
  const anyObj = input as any;
  const gameId = String(anyObj.gameId ?? anyObj.GameId ?? "");
  const jogadorX = String(anyObj.jogadorX ?? anyObj.JogadorX ?? "");
  const jogadorO = String(anyObj.jogadorO ?? anyObj.JogadorO ?? "");
  const seuSimbolo = String(anyObj.seuSimbolo ?? anyObj.SeuSimbolo ?? "");
  if (!gameId || !jogadorX || !jogadorO || !seuSimbolo) return null;
  return { gameId, jogadorX, jogadorO, seuSimbolo };
}

function coerceJoinResult(input: MatchJoinResult): {
  status: string;
  ticketId?: string;
  match?: MatchFoundEvent;
} {
  const status = String((input as any).status ?? (input as any).Status ?? "");
  const ticketId = String(
    (input as any).ticketId ?? (input as any).TicketId ?? "",
  );

  const match = coerceMatchFound(input);
  return {
    status: status || (match ? "matched" : "waiting"),
    ticketId: ticketId || undefined,
    match: match ?? undefined,
  };
}

export function useMatchmaking() {
  const router = useRouter();
  const toast = useToast();

  const nickname = useAppStore((s) => s.nickname);
  const setMatchmakingStatus = useAppStore((s) => s.setMatchmakingStatus);
  const setWaitingTicket = useAppStore((s) => s.setWaitingTicket);
  const clearWaitingTicket = useAppStore((s) => s.clearWaitingTicket);
  const setMatch = useAppStore((s) => s.setMatch);

  const realtime = useRealtime();

  const handleMatched = useCallback(
    async (payload: MatchFoundEvent) => {
      setMatch({
        gameId: payload.gameId,
        jogadorX: payload.jogadorX,
        jogadorO: payload.jogadorO,
        seuSimbolo: payload.seuSimbolo,
      });

      await realtime.joinRoom(payload.gameId);
      router.push(`/game/${payload.gameId}`);
    },
    [realtime, router, setMatch],
  );

  useEffect(() => {
    if (!nickname) return;

    const unsub = realtime.onMatchFound(async (p) => {
      const coerced = coerceMatchFound(p);
      if (!coerced) return;
      try {
        await handleMatched(coerced);
      } catch (err) {
        toast.show({
          type: "error",
          message:
            err instanceof Error ? err.message : "Falha ao entrar na sala",
        });
      }
    });

    return unsub;
  }, [handleMatched, nickname, realtime, toast]);

  const joinMutation = useMutation({
    mutationFn: async () => {
      setMatchmakingStatus("joining");
      await realtime.connect(nickname);
      return await joinMatchmaking(nickname);
    },
    onSuccess: async (raw) => {
      const parsed = coerceJoinResult(raw);
      const status = parsed.status.toLowerCase();

      if (parsed.match) {
        await handleMatched(parsed.match);
        return;
      }

      if (status.includes("wait") || status.includes("aguard")) {
        if (!parsed.ticketId) {
          toast.show({
            type: "error",
            message: "TicketId não retornado pelo backend.",
          });
          setMatchmakingStatus("error");
          return;
        }
        setWaitingTicket(parsed.ticketId);
        router.push("/waiting");
        return;
      }

      toast.show({
        type: "error",
        message: `Status inesperado: ${parsed.status}`,
      });
      setMatchmakingStatus("error");
    },
    onError: (err) => {
      setMatchmakingStatus("error");
      toast.show({
        type: "error",
        message:
          err instanceof Error ? err.message : "Erro ao entrar no matchmaking",
      });
    },
  });

  const leaveMutation = useMutation({
    mutationFn: async (ticketId: string) => {
      return await leaveMatchmaking(ticketId, nickname);
    },
    onSuccess: () => {
      clearWaitingTicket();
      setMatchmakingStatus("idle");
      router.push("/");
    },
    onError: (err) => {
      toast.show({
        type: "error",
        message: err instanceof Error ? err.message : "Erro ao cancelar",
      });
    },
  });

  const join = useCallback(async () => {
    if (!nickname) {
      toast.show({ type: "error", message: "Informe um nickname." });
      return;
    }
    await joinMutation.mutateAsync();
  }, [joinMutation, nickname, toast]);

  const leave = useCallback(
    async (ticketId: string) => {
      await leaveMutation.mutateAsync(ticketId);
    },
    [leaveMutation],
  );

  return {
    join,
    leave,
    isJoining: joinMutation.isPending,
    isLeaving: leaveMutation.isPending,
    connectionStatus: realtime.status,
  };
}

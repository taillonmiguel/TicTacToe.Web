"use client";

import { useCallback, useEffect } from "react";

import {
  createConnection,
  getConnection,
  identify,
  joinRoom,
  leaveRoom,
  offGameUpdated,
  offMatchFound,
  onGameUpdated,
  onMatchFound,
  startConnection,
  stopConnection,
} from "@/lib/signalr";
import type { GameUpdatedEvent } from "@/types/game";
import type { MatchFoundEvent } from "@/types/matchmaking";
import { useAppStore } from "@/store/appStore";

export function useRealtime() {
  const connectionStatus = useAppStore((s) => s.connectionStatus);
  const setConnectionStatus = useAppStore((s) => s.setConnectionStatus);

  const connect = useCallback(
    async (nickname: string) => {
      setConnectionStatus("connecting");
      try {
        const conn = createConnection();
        conn.onclose(() => setConnectionStatus("offline"));
        conn.onreconnecting(() => setConnectionStatus("connecting"));
        conn.onreconnected(() => setConnectionStatus("connected"));

        await startConnection();
        await identify(nickname);
        setConnectionStatus("connected");
      } catch (err) {
        setConnectionStatus("offline");
        throw err;
      }
    },
    [setConnectionStatus],
  );

  const disconnect = useCallback(async () => {
    setConnectionStatus("offline");
    await stopConnection();
  }, [setConnectionStatus]);

  const join = useCallback(async (gameId: string) => {
    await joinRoom(gameId);
  }, []);

  const leave = useCallback(async (gameId: string) => {
    await leaveRoom(gameId);
  }, []);

  const onMatch = useCallback((handler: (p: MatchFoundEvent) => void) => {
    onMatchFound(handler);
    return () => offMatchFound(handler);
  }, []);

  const onGame = useCallback((handler: (p: GameUpdatedEvent) => void) => {
    onGameUpdated(handler);
    return () => offGameUpdated(handler);
  }, []);

  useEffect(() => {
    void getConnection();
  }, []);

  return {
    status: connectionStatus,
    connect,
    disconnect,
    joinRoom: join,
    leaveRoom: leave,
    onMatchFound: onMatch,
    onGameUpdated: onGame,
  };
}

"use client";

import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";

import { hubUrl } from "@/lib/env";
import type { GameUpdatedEvent } from "@/types/game";
import type { MatchFoundEvent } from "@/types/matchmaking";

type MatchFoundHandler = (payload: MatchFoundEvent) => void;
type GameUpdatedHandler = (payload: GameUpdatedEvent) => void;

let connection: HubConnection | null = null;

export function getConnection() {
  return connection;
}

export function getConnectionState() {
  return connection?.state ?? HubConnectionState.Disconnected;
}

export function createConnection() {
  if (connection) return connection;

  connection = new HubConnectionBuilder()
    .withUrl(hubUrl())
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();

  return connection;
}

export async function startConnection() {
  const conn = createConnection();
  if (conn.state === HubConnectionState.Connected) return;
  if (conn.state === HubConnectionState.Connecting) return;
  await conn.start();
}

export async function stopConnection() {
  if (!connection) return;
  try {
    await connection.stop();
  } finally {
    connection = null;
  }
}

export async function identify(nickname: string) {
  const conn = createConnection();
  await conn.invoke("Identify", nickname);
}

export async function joinRoom(gameId: string) {
  const conn = createConnection();
  await conn.invoke("JoinRoom", gameId);
}

export async function leaveRoom(gameId: string) {
  const conn = createConnection();
  await conn.invoke("LeaveRoom", gameId);
}

export function onMatchFound(handler: MatchFoundHandler) {
  const conn = createConnection();
  conn.on("MatchFound", handler as any);
}

export function offMatchFound(handler: MatchFoundHandler) {
  const conn = createConnection();
  conn.off("MatchFound", handler as any);
}

export function onGameUpdated(handler: GameUpdatedHandler) {
  const conn = createConnection();
  conn.on("GameUpdated", handler as any);
}

export function offGameUpdated(handler: GameUpdatedHandler) {
  const conn = createConnection();
  conn.off("GameUpdated", handler as any);
}

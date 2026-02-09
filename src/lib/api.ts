import { apiBaseUrl } from "@/lib/env";
import type { ActionDto } from "@/types/actions";
import type { PartidaDto } from "@/types/game";
import type { MatchJoinResult } from "@/types/matchmaking";
import type { RankingDto } from "@/types/ranking";

type HttpMethod = "GET" | "POST";

async function requestJson<T>(
  path: string,
  method: HttpMethod,
  body?: unknown,
) {
  const base = apiBaseUrl();
  const url = `${base}${path}`;

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });

  const text = await res.text();
  const payload = text ? safeJsonParse(text) : undefined;

  if (!res.ok) {
    const message =
      typeof payload === "object" && payload && "message" in payload
        ? String((payload as any).message)
        : `Erro HTTP ${res.status}`;
    throw new Error(message);
  }

  return payload as T;
}

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function unwrapDados<T>(maybe: unknown): T {
  if (maybe && typeof maybe === "object") {
    const anyObj = maybe as any;
    if ("dados" in anyObj) return anyObj.dados as T;
    if ("data" in anyObj) return anyObj.data as T;
  }
  return maybe as T;
}

export async function joinMatchmaking(nickname: string) {
  const raw = await requestJson<unknown>(`/api/v1/matchmaking/join`, "POST", {
    nickname,
  });
  return unwrapDados<MatchJoinResult>(raw);
}

export async function leaveMatchmaking(ticketId: string, nickname: string) {
  const raw = await requestJson<unknown>(`/api/v1/matchmaking/leave`, "POST", {
    ticketId,
    nickname,
  });
  return unwrapDados<{ ok?: boolean }>(raw);
}

export async function getGame(id: string) {
  const raw = await requestJson<unknown>(`/api/v1/games/${id}`, "GET");
  return unwrapDados<PartidaDto>(raw);
}

export async function postMove(params: {
  id: string;
  nickname: string;
  posicao: number;
}) {
  const raw = await requestJson<unknown>(
    `/api/v1/games/${params.id}/moves`,
    "POST",
    { nickname: params.nickname, posicao: params.posicao },
  );
  return unwrapDados<{ ok?: boolean }>(raw);
}

export async function getHistory(take = 50) {
  const raw = await requestJson<unknown>(
    `/api/v1/games/history?take=${take}`,
    "GET",
  );
  return unwrapDados<PartidaDto[]>(raw);
}

export async function getRanking(take = 10) {
  const raw = await requestJson<unknown>(
    `/api/v1/games/ranking?take=${take}`,
    "GET",
  );
  return unwrapDados<RankingDto[]>(raw);
}

export async function getActions(gameId: string, take = 200) {
  const raw = await requestJson<unknown>(
    `/api/v1/games/${gameId}/actions?take=${take}`,
    "GET",
  );
  return unwrapDados<ActionDto[]>(raw);
}

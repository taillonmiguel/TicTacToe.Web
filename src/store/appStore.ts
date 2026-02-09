import { create } from "zustand";

export type ConnectionStatus = "offline" | "connecting" | "connected";
export type MatchmakingStatus =
  | "idle"
  | "joining"
  | "waiting"
  | "matched"
  | "error";

type AppState = {
  nickname: string;
  connectionStatus: ConnectionStatus;
  matchmakingStatus: MatchmakingStatus;

  ticketId?: string;
  currentGameId?: string;

  jogadorX?: string;
  jogadorO?: string;
  seuSimbolo?: string;

  setNickname: (nickname: string) => void;
  setConnectionStatus: (s: ConnectionStatus) => void;
  setMatchmakingStatus: (s: MatchmakingStatus) => void;

  setWaitingTicket: (ticketId: string) => void;
  clearWaitingTicket: () => void;

  setMatch: (p: {
    gameId: string;
    jogadorX: string;
    jogadorO: string;
    seuSimbolo: string;
  }) => void;
  clearMatch: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  nickname:
    typeof window !== "undefined"
      ? (localStorage.getItem("tictactoe:nickname") ?? "")
      : "",
  connectionStatus: "offline",
  matchmakingStatus: "idle",

  setNickname: (nickname) => {
    try {
      const v = nickname ?? "";
      if (v) localStorage.setItem("tictactoe:nickname", v);
      else localStorage.removeItem("tictactoe:nickname");
    } catch {
      // ignore
    }
    set({ nickname });
  },
  setConnectionStatus: (connectionStatus) => set({ connectionStatus }),
  setMatchmakingStatus: (matchmakingStatus) => set({ matchmakingStatus }),

  setWaitingTicket: (ticketId) =>
    set({ ticketId, matchmakingStatus: "waiting" }),
  clearWaitingTicket: () => set({ ticketId: undefined }),

  setMatch: ({ gameId, jogadorX, jogadorO, seuSimbolo }) =>
    set({
      currentGameId: gameId,
      jogadorX,
      jogadorO,
      seuSimbolo,
      matchmakingStatus: "matched",
      ticketId: undefined,
    }),
  clearMatch: () =>
    set({
      currentGameId: undefined,
      jogadorX: undefined,
      jogadorO: undefined,
      seuSimbolo: undefined,
      matchmakingStatus: "idle",
    }),
}));

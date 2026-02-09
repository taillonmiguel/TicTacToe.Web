import Link from "next/link";

import { PlayerBadge } from "@/components/game/PlayerBadge";

export function GameHeader(props: {
  gameId: string;
  jogadorX: string;
  jogadorO: string;
  seuSimbolo?: string;
  connectionStatus: string;
  turnoLabel: string;
  turnoAtual?: string;
}) {
  const turno = String(props.turnoAtual ?? props.turnoLabel ?? "").trim();
  const upper = turno.toUpperCase();
  const activeX = upper === "X" || turno === props.jogadorX;
  const activeO = upper === "O" || turno === props.jogadorO;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <Link className="underline opacity-90 hover:opacity-100" href="/">
          Voltar
        </Link>
        <div className="text-xs opacity-70">
          Conexão: {props.connectionStatus}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-sm opacity-80">Game: {props.gameId}</div>
        <div className="text-sm">
          Você é{" "}
          <span className="font-semibold">{props.seuSimbolo ?? "?"}</span>
        </div>
        <div className="text-sm">
          Turno: <span className="font-semibold">{props.turnoLabel}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <PlayerBadge label="X" nickname={props.jogadorX} active={activeX} />
        <PlayerBadge label="O" nickname={props.jogadorO} active={activeO} />
      </div>
    </div>
  );
}

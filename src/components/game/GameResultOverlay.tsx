"use client";

import { useMemo } from "react";

import { Button } from "@/components/ui/Button";

type Props = {
  open: boolean;
  kind: "win" | "lose" | "draw";
  title: string;
  description: string;
  onBack: () => void;
  onReplay: () => void;
};

function Confetti() {
  const pieces = useMemo(() => {
    const colors = [
      "#60a5fa",
      "#34d399",
      "#fbbf24",
      "#f472b6",
      "#a78bfa",
      "#fb7185",
    ];

    return Array.from({ length: 26 }, (_, i) => {
      const x = ((i * 37) % 100) / 100;
      const delay = ((i * 19) % 60) / 100;
      const duration = 1.8 + ((i * 11) % 10) / 10;
      const rotate = (i * 43) % 360;
      const color = colors[i % colors.length];
      return { i, x, delay, duration, rotate, color };
    });
  }, []);

  return (
    <div className="confetti" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.i}
          className="confettiPiece"
          style={
            {
              "--x": `${p.x * 100}%`,
              "--delay": `${p.delay}s`,
              "--dur": `${p.duration}s`,
              "--rot": `${p.rotate}deg`,
              "--c": p.color,
            } as any
          }
        />
      ))}
    </div>
  );
}

export function GameResultOverlay(props: Props) {
  if (!props.open) return null;

  const isWin = props.kind === "win";
  const isDraw = props.kind === "draw";
  const isLose = props.kind === "lose";

  return (
    <div
      className={isDraw ? "overlayRoot overlayDraw" : "overlayRoot overlayWin"}
      role="dialog"
      aria-modal="true"
    >
      {isWin ? <Confetti /> : null}

      <div className={`overlayCard ${isLose ? "overlayShake" : ""}`.trim()}>
        <div className="text-center">
          <div className="text-3xl font-extrabold tracking-tight">
            {props.title}
          </div>
          <div className="mt-2 text-lg font-semibold">{props.description}</div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="secondary" onClick={props.onBack}>
            Voltar
          </Button>
          <Button onClick={props.onReplay}>Jogar novamente</Button>
        </div>
      </div>
    </div>
  );
}

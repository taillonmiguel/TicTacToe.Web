import type { CellValue, GameView } from "@/lib/gameModel";

const winningLines: readonly (readonly [number, number, number])[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

function normalizeToCells(board: string | CellValue[]): CellValue[] {
  if (Array.isArray(board)) return board.slice(0, 9);

  const arr: CellValue[] = [];
  for (let i = 0; i < Math.min(9, board.length); i++) {
    const ch = board[i]?.toUpperCase();
    arr.push(ch === "X" || ch === "O" ? ch : null);
  }
  while (arr.length < 9) arr.push(null);
  return arr;
}

export function calcularLinhaVencedora(
  board: string | CellValue[],
): number[] | null {
  const cells = normalizeToCells(board);

  for (const [a, b, c] of winningLines) {
    const v = cells[a];
    if (!v) continue;
    if (cells[b] === v && cells[c] === v) return [a, b, c];
  }

  return null;
}

export type GameOutcome =
  | { kind: "none" }
  | { kind: "win"; vencedor: string; simbolo?: "X" | "O" }
  | { kind: "draw" };

function asSymbol(raw: unknown): "X" | "O" | undefined {
  const upper = String(raw ?? "")
    .trim()
    .toUpperCase();
  if (upper === "X" || upper === "O") return upper;
  return undefined;
}

export function getOutcomeFromGame(game: GameView | null): GameOutcome {
  if (!game) return { kind: "none" };

  const vencedor = game.vencedor ? String(game.vencedor).trim() : "";
  if (vencedor) {
    return { kind: "win", vencedor, simbolo: asSymbol(game.resultadoRaw) };
  }

  const resultado = String(game.resultadoRaw ?? "").toLowerCase();
  if (
    resultado.includes("empate") ||
    resultado.includes("draw") ||
    resultado.includes("velha") ||
    resultado.includes("tie")
  ) {
    return { kind: "draw" };
  }

  const maybeSymbol = asSymbol(game.resultadoRaw);
  if (maybeSymbol) {
    return { kind: "win", vencedor: maybeSymbol, simbolo: maybeSymbol };
  }

  return { kind: "none" };
}

export function stringEqualsIgnoreCase(a?: string | null, b?: string | null) {
  return (
    String(a ?? "")
      .trim()
      .toLowerCase() ===
    String(b ?? "")
      .trim()
      .toLowerCase()
  );
}

function isFinalizado(status: unknown) {
  const s = String(status ?? "").trim();
  if (!s) return false;
  return (
    stringEqualsIgnoreCase(s, "Finalizado") ||
    s.toLowerCase().includes("finaliz")
  );
}

export function getMensagemFinal(params: {
  status: unknown;
  resultado: unknown;
  vencedor: unknown;
  meuNickname: string;
}): {
  titulo: string;
  descricao: string;
  kind: "win" | "lose" | "draw";
} | null {
  if (!isFinalizado(params.status)) return null;

  const vencedor = String(params.vencedor ?? "").trim();
  const resultado = String(params.resultado ?? "").trim();
  const resultadoLower = resultado.toLowerCase();

  const empate =
    !vencedor ||
    resultadoLower.includes("empate") ||
    resultadoLower.includes("draw") ||
    resultadoLower.includes("velha") ||
    resultadoLower.includes("tie");

  if (empate) {
    return {
      kind: "draw",
      titulo: "🤝 Deu velha!",
      descricao: "Ninguém venceu dessa vez.",
    };
  }

  const euGanhei =
    vencedor && stringEqualsIgnoreCase(vencedor, params.meuNickname);

  if (euGanhei) {
    return {
      kind: "win",
      titulo: "🎉 Você ganhou!",
      descricao: "Mandou bem! 🥳",
    };
  }

  return {
    kind: "lose",
    titulo: "😅 Você quase ganhou",
    descricao: `${vencedor} venceu essa. Quer tentar de novo?`,
  };
}

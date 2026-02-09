import { apiBaseUrl } from "@/lib/env";

export type EstrategiaVitoriosaItem = {
  estrategia: string;
  vitorias: number;
  percentual: number;
};

export type EstrategiasVitoriosasResponse = {
  totalVitorias: number;
  itens: EstrategiaVitoriosaItem[];
};

type HttpMethod = "GET";

async function requestJson<T>(path: string, method: HttpMethod) {
  const base = apiBaseUrl();
  const url = `${base}${path}`;

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
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

function toNumber(v: unknown, fallback = 0) {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeItem(raw: any): EstrategiaVitoriosaItem {
  const estrategia = String(
    raw?.estrategia ?? raw?.Estrategia ?? raw?.name ?? raw?.Nome ?? "-",
  );
  const vitorias = toNumber(
    raw?.vitorias ?? raw?.Vitorias ?? raw?.wins ?? raw?.Wins,
    0,
  );
  const percentual = toNumber(
    raw?.percentual ?? raw?.Percentual ?? raw?.pct ?? raw?.Pct,
    0,
  );

  return {
    estrategia,
    vitorias,
    percentual,
  };
}

function normalizeResponse(raw: unknown): EstrategiasVitoriosasResponse {
  const unwrapped = unwrapDados<any>(raw);

  if (Array.isArray(unwrapped)) {
    const itens = unwrapped.map((x) => normalizeItem(x));
    const totalVitorias = itens.reduce(
      (acc, it) => acc + (it.vitorias || 0),
      0,
    );

    return { totalVitorias, itens };
  }

  const total =
    (unwrapped && typeof unwrapped === "object"
      ? ((unwrapped as any).totalVitorias ??
        (unwrapped as any).TotalVitorias ??
        (unwrapped as any).total ??
        (unwrapped as any).Total)
      : 0) ?? 0;

  const list =
    (unwrapped && typeof unwrapped === "object"
      ? ((unwrapped as any).itens ??
        (unwrapped as any).Itens ??
        (unwrapped as any).strategies ??
        (unwrapped as any).Strategies ??
        (unwrapped as any).items ??
        (unwrapped as any).Items)
      : []) ?? [];

  const itens = Array.isArray(list) ? list.map((x) => normalizeItem(x)) : [];
  const totalVitorias = toNumber(
    total,
    itens.reduce((acc, it) => acc + (it.vitorias || 0), 0),
  );

  return { totalVitorias, itens };
}

export const analyticsApi = {
  async getEstrategiasVitoriosas(
    take = 10,
  ): Promise<EstrategiasVitoriosasResponse> {
    const raw = await requestJson<unknown>(
      `/api/v1/analytics/strategies?take=${take}`,
      "GET",
    );
    return normalizeResponse(raw);
  },
};

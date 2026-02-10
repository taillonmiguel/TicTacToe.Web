"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type ToastType = "error" | "info" | "success";
export type ToastItem = {
  id: string;
  type: ToastType;
  message: string;
};

type ToastContextValue = {
  show: (t: Omit<ToastItem, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function randomId() {
  return Math.random().toString(36).slice(2);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const show = useCallback((t: Omit<ToastItem, "id">) => {
    const id = randomId();
    const item: ToastItem = { id, ...t };
    setItems((prev) => [...prev, item]);

    window.setTimeout(() => {
      setItems((prev) => prev.filter((x) => x.id !== id));
    }, 3500);
  }, []);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex w-[min(320px,calc(100vw-2rem))] flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className="rounded-lg border border-foreground/10 bg-background px-4 py-3 text-sm"
          >
            <div className="font-medium">
              {t.type === "error"
                ? "Erro"
                : t.type === "success"
                  ? "Sucesso"
                  : "Info"}
            </div>
            <div className="mt-1 opacity-90">{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("ToastProvider não encontrado.");
  return ctx;
}

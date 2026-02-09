"use client";

import { useMemo, useState } from "react";

import { Input } from "@/components/ui/Input";
import { BotaoNostalgico } from "@/components/ui/BotaoNostalgico";
import { useAppStore } from "@/store/appStore";
import { useMatchmaking } from "@/hooks/useMatchmaking";

const nicknameRegex = /^[A-Za-z0-9_]+$/;

function validateNickname(nickname: string) {
  const trimmed = nickname.trim();
  if (trimmed.length < 3 || trimmed.length > 20) {
    return "Nickname deve ter 3 a 20 caracteres.";
  }
  if (!nicknameRegex.test(trimmed)) {
    return "Use apenas letras, números e underscore (_).";
  }
  return null;
}

export function NicknameForm() {
  const storedNickname = useAppStore((s) => s.nickname);
  const setNickname = useAppStore((s) => s.setNickname);

  const [nickname, setLocalNickname] = useState(storedNickname);
  const error = useMemo(() => validateNickname(nickname), [nickname]);

  const { join, isJoining, connectionStatus } = useMatchmaking();

  const badge = useMemo(() => {
    const s = String(connectionStatus ?? "").toLowerCase();
    if (s.includes("connected")) {
      return {
        label: "conectado",
        cls: "border-green-300 bg-green-100 text-green-800",
      };
    }
    if (s.includes("connecting")) {
      return {
        label: "conectando",
        cls: "border-yellow-300 bg-yellow-100 text-yellow-900",
      };
    }
    return {
      label: "offline",
      cls: "border-red-300 bg-red-100 text-red-800",
    };
  }, [connectionStatus]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end justify-between gap-3">
        <label className="text-sm font-semibold" htmlFor="nickname">
          Seu nickname
        </label>
        <span
          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${badge.cls}`}
          aria-label={`status-${badge.label}`}
          title={String(connectionStatus)}
        >
          {badge.label}
        </span>
      </div>
      <Input
        id="nickname"
        placeholder="Ex: Taillon_01"
        value={nickname}
        onChange={(e) => {
          const v = e.target.value;
          setLocalNickname(v);
          setNickname(v.trim());
        }}
        maxLength={20}
        autoComplete="off"
      />
      {error ? (
        <div className="text-sm opacity-80">{error}</div>
      ) : (
        <div className="text-xs opacity-70">
          Use 3 a 20 caracteres, apenas letras/números/underscore.
        </div>
      )}

      <BotaoNostalgico
        variant="verde"
        onClick={async () => {
          const err = validateNickname(nickname);
          if (err) return;
          setNickname(nickname.trim());
          await join();
        }}
        disabled={Boolean(error) || isJoining}
      >
        {isJoining ? "Conectando..." : "Jogar"}
      </BotaoNostalgico>
    </div>
  );
}

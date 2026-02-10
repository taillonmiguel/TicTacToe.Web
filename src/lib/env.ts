type PublicEnvName = "NEXT_PUBLIC_API_URL" | "NEXT_PUBLIC_HUB_URL";

function readPublicEnv(name: PublicEnvName) {
  switch (name) {
    case "NEXT_PUBLIC_API_URL":
      return process.env.NEXT_PUBLIC_API_URL;
    case "NEXT_PUBLIC_HUB_URL":
      return process.env.NEXT_PUBLIC_HUB_URL;
  }
}

export function getEnv(name: "NEXT_PUBLIC_API_URL"): string;
export function getEnv(name: "NEXT_PUBLIC_HUB_URL"): string | undefined;
export function getEnv(name: PublicEnvName) {
  const value = readPublicEnv(name);
  return value && value.trim().length > 0 ? value : undefined;
}

export function apiBaseUrl() {
  const value = getEnv("NEXT_PUBLIC_API_URL");
  if (!value) throw new Error("Missing env: NEXT_PUBLIC_API_URL");
  return value;
}

export function hubUrl() {
  const explicit = getEnv("NEXT_PUBLIC_HUB_URL");
  if (explicit) return explicit;
  return `${apiBaseUrl()}/hubs/tictactoe`;
}

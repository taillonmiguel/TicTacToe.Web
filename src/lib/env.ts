export function getEnv(name: string, fallback?: string) {
  const value = process.env[name];
  if (value && value.trim().length > 0) return value;
  return fallback;
}

export function apiBaseUrl() {
  return getEnv("NEXT_PUBLIC_API_URL", "http://localhost:8080")!;
}

export function hubUrl() {
  return getEnv("NEXT_PUBLIC_HUB_URL", `${apiBaseUrl()}/hubs/tictactoe`)!;
}

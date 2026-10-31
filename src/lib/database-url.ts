/**
 * Returns the runtime database URL with safe pool settings.
 * The Supabase transaction pooler (pgbouncer) handles many client connections,
 * so a pool of 1 makes parallel page queries queue up and time out (P2024).
 */
export function databaseUrl() {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    throw new Error("DATABASE_URL is not set");
  }
  try {
    const url = new URL(raw);
    const limit = Number(url.searchParams.get("connection_limit") ?? "0");
    if (!limit || limit < 5) url.searchParams.set("connection_limit", "5");
    const timeout = Number(url.searchParams.get("pool_timeout") ?? "0");
    if (!timeout || timeout < 20) url.searchParams.set("pool_timeout", "20");
    return url.toString();
  } catch {
    return raw;
  }
}

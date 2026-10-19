export type Currency = "INR" | "USD";

const USD_RATE = 83;

function groupIndian(whole: string) {
  if (whole.length <= 3) return whole;
  const head = whole.slice(0, -3);
  const tail = whole.slice(-3);
  return `${head.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${tail}`;
}

export function formatMoney(amountInr: number, currency: Currency = "INR") {
  if (currency === "USD") {
    const usd = amountInr / USD_RATE;
    const sign = usd < 0 ? "-" : "";
    return `${sign}$${Math.abs(usd).toFixed(2)}`;
  }

  const sign = amountInr < 0 ? "-" : "";
  const [whole, fraction] = Math.abs(amountInr).toFixed(2).split(".");
  return `${sign}₹${groupIndian(whole)}.${fraction}`;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function discountPercent(price: number, compareAtPrice?: number | null) {
  if (!compareAtPrice || compareAtPrice <= price) return null;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export function absoluteUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

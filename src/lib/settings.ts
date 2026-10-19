import { prisma } from "@/lib/prisma";

export const settingDefaults = {
  promoText: "Get 10% OFF on Prepaid",
  phone: "+91 70205 07645",
  hours: "Mon – Sat (10am – 7pm)",
  email: "support@swissworldwatch.com",
  address: "Lower Parel, Mumbai — 400013",
  whatsapp: "917020507645",
  telegram: "https://t.me/swissworldwatch",
  prepaidDiscount: "10",
  heroTitle: "SWISS AUTOMATIC WATCHES",
  heroLine2: "10% DISCOUNT ON PREPAID",
  heroLine3: "CASH ON DELIVERY AVAILABLE IN INDIA",
  heroImage: "/catalog/hero.jpg",
  storeBlurb:
    "Trusted online store for Swiss automatic and quartz watches, with insured shipping across India.",
} as const;

export type SettingKey = keyof typeof settingDefaults;

export async function getSettings() {
  const rows = await prisma.siteSetting.findMany();
  const map = Object.fromEntries(rows.map((row) => [row.key, row.value]));
  const merged = { ...settingDefaults, ...map };
  return {
    ...merged,
    prepaidDiscount: Number(merged.prepaidDiscount) || 0,
  };
}

export async function getCurrency(): Promise<"INR" | "USD"> {
  const { cookies } = await import("next/headers");
  const value = (await cookies()).get("sww_currency")?.value;
  return value === "USD" ? "USD" : "INR";
}

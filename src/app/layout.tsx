import type { Metadata } from "next";
import { Oswald, Outfit, Playball } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-oswald",
});

const playball = Playball({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  applicationName: "Swiss World Watch",
  title: {
    default: "Swiss World Watch",
    template: "%s | Swiss World Watch",
  },
  description:
    "Shop Swiss automatic and quartz watches online in India. Prepaid discount, cash on delivery, and insured shipping.",
  openGraph: {
    type: "website",
    siteName: "Swiss World Watch",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${oswald.variable} ${playball.variable} h-full`}>
      <body className="min-h-full bg-white text-ink antialiased">{children}</body>
    </html>
  );
}

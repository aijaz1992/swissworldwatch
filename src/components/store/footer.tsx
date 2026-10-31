import { BrandLogo } from "@/components/brand/logo";
import Link from "next/link";

const hubs = ["Delhi", "Bangalore", "Pune", "Surat", "Ahmedabad", "Kolkata", "Hyderabad", "Lucknow", "Nagpur", "Jaipur"];

export function Footer({
  settings,
  brands,
  categories = [],
}: {
  settings: {
    phone: string;
    hours: string;
    email: string;
    address: string;
    storeBlurb: string;
    telegram: string;
  };
  brands: { name: string; slug: string }[];
  categories?: { name: string; slug: string }[];
}) {
  return (
    <footer className="mt-8 bg-ink text-neutral-300">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" aria-label="Swiss World Watch home" className="inline-block">
            <BrandLogo className="w-[200px]" />
          </Link>
          <p className="mt-4 text-sm leading-6 text-neutral-400">{settings.storeBlurb}</p>
          <a
            href={settings.telegram}
            className="btn-sky mt-4"
            target="_blank"
            rel="noreferrer"
          >
            Join our Telegram
          </a>
          <div className="mt-6 text-sm leading-6">
            <p className="text-xs font-semibold tracking-wide text-neutral-500">CALL SUPPORT</p>
            <p className="font-semibold text-[#d4b06a]">{settings.phone}</p>
            <p className="text-xs text-neutral-500">{settings.hours}</p>
            <p className="mt-3 text-xs font-semibold tracking-wide text-neutral-500">EMAIL DESK</p>
            <a className="text-[#d4b06a]" href={`mailto:${settings.email}`}>
              {settings.email}
            </a>
            <p className="mt-3 text-xs font-semibold tracking-wide text-neutral-500">SHOWROOM</p>
            <p>{settings.address}</p>
          </div>
        </div>
        <FooterColumn title="Company">
          <FooterLink href="/">Home</FooterLink>
          <FooterLink href="/about">About Us</FooterLink>
          <FooterLink href="/#why-us">Why Us</FooterLink>
          <FooterLink href="/policies#privacy">Privacy Policy</FooterLink>
          <FooterLink href="/policies#returns">Return Policy</FooterLink>
          <FooterLink href="/policies#shipping">Shipping Policy</FooterLink>
          <FooterLink href="/policies">Terms & Conditions</FooterLink>
          <FooterLink href="/policies#warranty">Warranty Desk</FooterLink>
          <FooterLink href="/blog">Editorial Blog</FooterLink>
        </FooterColumn>
        <FooterColumn title="Regional Hubs">
          {hubs.map((hub) => (
            <FooterLink key={hub} href={`/watches?hub=${encodeURIComponent(hub)}`}>
              Watches in {hub}
            </FooterLink>
          ))}
        </FooterColumn>
        <FooterColumn title="Collections">
          {brands.map((brand) => (
            <FooterLink key={brand.slug} href={`/watches/${brand.slug}`}>
              {brand.name}
            </FooterLink>
          ))}
          {categories.map((category) => (
            <FooterLink key={category.slug} href={`/watches/${category.slug}`}>
              {category.name}
            </FooterLink>
          ))}
          <FooterLink href="/watches?gender=MEN">Men&apos;s Watches</FooterLink>
          <FooterLink href="/watches?gender=WOMEN">Women&apos;s Watches</FooterLink>
          <FooterLink href="/watches?sale=1">Sale</FooterLink>
        </FooterColumn>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-[1240px] px-4 py-4 text-center text-xs leading-6 text-neutral-500">
          {brands.map((brand, index) => (
            <span key={brand.slug}>
              {index > 0 && " | "}
              <Link href={`/watches/${brand.slug}`} className="hover:text-[#d4b06a]">
                {brand.name} Watches
              </Link>
            </span>
          ))}
        </p>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1240px] flex-col items-center justify-between gap-3 px-4 py-4 text-xs text-neutral-500 sm:flex-row">
          <p>Copyright © {new Date().getFullYear()} Swiss World Watch. All rights reserved.</p>
          <div className="flex items-center gap-2">
            {["UPI", "VISA", "MC", "COD"].map((label) => (
              <span key={label} className="border border-white/20 px-2 py-1 text-[10px] font-semibold tracking-wide">
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="border-b border-[#d4b06a]/50 pb-1 text-sm font-semibold tracking-wide text-white">{title}</h2>
      <div className="mt-4 flex flex-col gap-2 text-sm text-neutral-400">{children}</div>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="py-0.5 outline-none transition-colors hover:text-[#d4b06a] focus-visible:text-[#d4b06a] focus-visible:underline focus-visible:underline-offset-4">
      {children}
    </Link>
  );
}

export function WhatsAppButton({ phone }: { phone: string }) {
  const digits = phone.replace(/\D/g, "");
  return (
    <a
      href={`https://wa.me/${digits}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-white shadow-lg"
    >
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor" aria-hidden>
        <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.4a10 10 0 0 0 4.65 1.18h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2zm5.76 14.15c-.24.68-1.4 1.3-1.94 1.38-.5.07-1.12.1-1.81-.11-.41-.13-.95-.31-1.64-.61-2.89-1.25-4.77-4.16-4.91-4.35-.14-.19-1.17-1.55-1.17-2.96s.74-2.1 1-2.39c.24-.27.64-.39.96-.39h.23c.22 0 .51-.04.78.6.28.68.96 2.34 1.04 2.51.08.17.14.37.03.58-.1.22-.16.35-.31.54-.16.19-.33.42-.47.56-.16.16-.32.33-.14.64.19.31.83 1.37 1.79 2.22 1.23 1.09 2.27 1.43 2.59 1.59.32.16.51.13.7-.08.19-.22.8-.93 1.02-1.25.21-.32.43-.26.72-.16.29.1 1.84.87 2.16 1.03.32.16.53.24.61.37.08.13.08.76-.16 1.44z" />
      </svg>
    </a>
  );
}

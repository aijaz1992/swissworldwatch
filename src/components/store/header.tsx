"use client";

import { logoutAction, setCurrency } from "@/actions/store";
import { BrandLogo } from "@/components/brand/logo";
import type { Currency } from "@/lib/format";
import Link from "next/link";
import { useState } from "react";

type LinkItem = { name: string; slug: string };

export function Header({
  promoText,
  phone,
  hours,
  brands,
  categories = [],
  cartCount,
  user,
  currency,
}: {
  promoText: string;
  phone: string;
  hours: string;
  brands: LinkItem[];
  categories?: LinkItem[];
  cartCount: number;
  user: { name: string; role: "USER" | "ADMIN" } | null;
  currency: Currency;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="bg-white">
      <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:bg-white focus:px-3 focus:py-2">
        Skip to content
      </a>
      <div className="bg-pillow py-1.5 text-center text-[13px] text-sky">{promoText}</div>
      <div className="bg-ink text-white">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-3 px-4 py-2.5">
          <p className="min-w-0 truncate text-sm">
            Call/WhatsApp {phone} · {hours}
          </p>
          <div className="hidden items-center gap-3 sm:flex">
            <CurrencySelect currency={currency} id="currency-desktop" />
            <SearchButton open={searchOpen} onToggle={() => setSearchOpen((open) => !open)} />
          </div>
        </div>
        <div className="flex items-center justify-end gap-5 px-4 pb-2.5 text-sm sm:hidden">
          <CurrencySelect currency={currency} id="currency-mobile" />
          <Link href={user ? "/account" : "/login"} className="hover:underline">
            {user ? "Account" : "Login / Register"}
          </Link>
          <SearchButton open={searchOpen} onToggle={() => setSearchOpen((open) => !open)} />
        </div>
        {searchOpen && (
          <form action="/watches" className="mx-auto flex max-w-[1240px] gap-2 px-4 pb-3">
            <label className="sr-only" htmlFor="header-search">
              Search watches
            </label>
            <input
              id="header-search"
              name="q"
              autoFocus
              placeholder="Search watches, brands, dials"
              className="input text-ink"
            />
            <button className="bg-neutral-950 px-4 text-sm text-white">Search</button>
          </form>
        )}
      </div>

      <div className="sticky top-0 z-40 border-b border-neutral-200 bg-white">
        <div className="mx-auto grid max-w-[1240px] grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3 lg:flex lg:justify-between">
          <button
            type="button"
            className="p-1 xl:hidden"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <MenuIcon />
          </button>
          <Logo />
          <nav className="hidden items-center gap-4 xl:flex" aria-label="Primary">
            <Dropdown label="Men's Watches" href="/watches?gender=MEN" brands={brands} />
            <Dropdown label="Women's Watches" href="/watches?gender=WOMEN" brands={brands} />
            <Dropdown label="Brands" href="/watches" brands={brands} />
            <Link href="/about" className="text-base text-neutral-800 hover:text-sky">
              About us
            </Link>
            <Link href="/#why-us" className="text-base text-neutral-800 hover:text-sky">
              Why us
            </Link>
            <Link href="/watches?sale=1" className="bg-sale px-2.5 py-1 text-sm font-semibold text-white">
              Sale
            </Link>
          </nav>
          <div className="flex items-center justify-end gap-4">
            {user ? (
              <div className="hidden items-center gap-3 text-sm sm:flex">
                {user.role === "ADMIN" && (
                  <Link href="/admin" className="font-medium text-sky">
                    Admin
                  </Link>
                )}
                <Link href="/account" className="hover:text-sky">
                  {user.name.split(" ")[0]}
                </Link>
                <form action={logoutAction}>
                  <button className="hover:text-sky">Logout</button>
                </form>
              </div>
            ) : (
              <Link href="/login" className="hidden text-sm text-neutral-800 hover:text-sky sm:inline">
                Login / Register
              </Link>
            )}
            <Link href="/cart" className="relative text-sky" aria-label={`Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}>
              <CartIcon />
              <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-sale px-1 text-[11px] font-semibold text-white">
                {cartCount}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] xl:hidden" data-mobile-menu>
          <button className="absolute inset-0 bg-black/40" aria-label="Close menu" onClick={() => setMenuOpen(false)} />
          <nav className="absolute left-0 top-0 flex h-full w-[min(100%,320px)] flex-col gap-0.5 overflow-y-auto overscroll-contain bg-white p-5 pb-24 shadow-xl" aria-label="Mobile">
            <div className="mb-3 flex items-center justify-between">
              <BrandLogo className="w-[120px]" />
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="text-2xl leading-none">
                ×
              </button>
            </div>
            <MobileLink href="/watches?gender=MEN" onClick={() => setMenuOpen(false)}>
              Men&apos;s Watches
            </MobileLink>
            <MobileLink href="/watches?gender=WOMEN" onClick={() => setMenuOpen(false)}>
              Women&apos;s Watches
            </MobileLink>
            <MobileLink href="/about" onClick={() => setMenuOpen(false)}>
              About us
            </MobileLink>
            <MobileLink href="/#why-us" onClick={() => setMenuOpen(false)}>
              Why us
            </MobileLink>
            <MobileLink href="/watches?sale=1" onClick={() => setMenuOpen(false)}>
              Sale
            </MobileLink>
            {categories.length > 0 && (
              <>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-neutral-400">Categories</p>
                {categories.map((category) => (
                  <MobileLink key={category.slug} href={`/watches/${category.slug}`} onClick={() => setMenuOpen(false)}>
                    {category.name}
                  </MobileLink>
                ))}
              </>
            )}
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-neutral-400">Brands</p>
            {brands.map((brand) => (
              <MobileLink key={brand.slug} href={`/watches/${brand.slug}`} onClick={() => setMenuOpen(false)}>
                {brand.name}
              </MobileLink>
            ))}
            <div className="mt-4 border-t pt-4">
              {user ? (
                <>
                  <MobileLink href="/account" onClick={() => setMenuOpen(false)}>
                    My account
                  </MobileLink>
                  {user.role === "ADMIN" && (
                    <MobileLink href="/admin" onClick={() => setMenuOpen(false)}>
                      Admin
                    </MobileLink>
                  )}
                  <form action={logoutAction}>
                    <button className="py-2 text-sm">Logout</button>
                  </form>
                </>
              ) : (
                <MobileLink href="/login" onClick={() => setMenuOpen(false)}>
                  Login / Register
                </MobileLink>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function Dropdown({ label, href, brands }: { label: string; href: string; brands: LinkItem[] }) {
  return (
    <div className="group relative">
      <Link href={href} className="inline-flex items-center gap-1 text-base text-neutral-800 hover:text-sky">
        {label}
        <Chevron />
      </Link>
      <div className="invisible absolute left-0 top-full z-50 min-w-56 border border-neutral-200 bg-white py-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <Link href={href} className="block px-4 py-2 text-sm font-medium hover:bg-sky/10">
          View all
        </Link>
        {brands.map((brand) => (
          <Link key={brand.slug} href={`/watches/${brand.slug}`} className="block px-4 py-2 text-sm hover:bg-sky/10">
            {brand.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

function Logo() {
  return (
    <Link href="/" className="justify-self-center flex items-center lg:justify-self-start" aria-label="Swiss World Watch home">
      <BrandLogo preload className="w-[150px] sm:w-[190px]" />
    </Link>
  );
}

function CurrencySelect({ currency, id }: { currency: Currency; id: string }) {
  return (
    <form action={setCurrency}>
      <label className="sr-only" htmlFor={id}>
        Currency
      </label>
      <select
        id={id}
        name="currency"
        key={currency}
        defaultValue={currency}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
        className="rounded-sm border border-neutral-300 bg-white px-2 py-1 text-sm text-neutral-900"
      >
        <option value="INR">INR</option>
        <option value="USD">Dollar</option>
      </select>
    </form>
  );
}

function SearchButton({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} aria-label="Search" aria-expanded={open} className="text-white">
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </svg>
    </button>
  );
}

function MobileLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="-mx-2 rounded-sm px-2 py-1.5 text-sm text-neutral-800 outline-none transition-colors hover:bg-[#d4b06a]/10 hover:text-[#a8843f] focus-visible:bg-[#d4b06a]/10 focus-visible:text-[#a8843f] focus-visible:ring-1 focus-visible:ring-[#d4b06a]/60"
    >
      {children}
    </Link>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 text-ink" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function Chevron() {
  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
      <path d="M5 7l5 6 5-6" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d="M6 6h15l-1.5 9h-12z" />
      <path d="M6 6L5 3H2" />
      <circle cx="9" cy="20" r="1.3" fill="currentColor" />
      <circle cx="18" cy="20" r="1.3" fill="currentColor" />
    </svg>
  );
}


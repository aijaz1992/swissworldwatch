import { CategoryImage } from "@/components/store/category-image";
import { BrandMarquee } from "@/components/store/brand-marquee";
import { HeroVideo } from "@/components/store/hero-video";
import { ProductCard } from "@/components/store/product-card";
import { productCardInclude } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { safe } from "@/lib/safe";
import Image from "next/image";
import Link from "next/link";

export default async function HomePage() {
  const [settings, signature, sale, brands, categories] = await Promise.all([
    getSettings(),
    safe(prisma.product.findMany({
      where: { status: "ACTIVE", featured: true },
      include: productCardInclude,
      orderBy: [{ bestSeller: "desc" }, { createdAt: "desc" }],
      take: 4,
    }), [], "home products"),
    safe(prisma.product.findMany({
      where: { status: "ACTIVE", NOT: { compareAtPrice: null } },
      include: productCardInclude,
      orderBy: { createdAt: "desc" },
      take: 12,
    }), [], "home products"),
    safe(prisma.brand.findMany({ where: { featured: true }, orderBy: { sortOrder: "asc" } }), [], "home brands"),
    safe(prisma.category.findMany({ orderBy: { sortOrder: "asc" } }), [], "home categories"),
  ]);

  const discounts = sale.filter((product) => (product.compareAtPrice ?? 0) > product.price).slice(0, 8);

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="relative min-h-[88vh] sm:min-h-[620px]">
          <HeroVideo poster={settings.heroImage} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />
          <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-[1240px] flex-col justify-center px-4 py-16 sm:min-h-[620px] sm:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#d4b06a]">Swiss World Watch</p>
            <h1 className="mt-4 max-w-2xl font-display text-5xl font-semibold uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              {settings.heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-xl text-white/90 sm:text-2xl">{settings.heroLine2}</p>
            <p className="mt-2 max-w-xl text-lg text-white/75">{settings.heroLine3}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/watches" className="btn-sky px-6 py-3 text-base">
                Shop watches
              </Link>
              <Link href="/watches?sale=1" className="btn-outline px-6 py-3 text-base">
                View sale
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-[1240px] gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { step: "01", title: "Browse the catalog", text: "Filter by brand, size, movement, and price." },
            { step: "02", title: "Open a watch", text: "Read the specification, stock, and studio photos." },
            { step: "03", title: "Add to cart", text: "Choose quantity, then prepaid or cash on delivery." },
            { step: "04", title: "Delivery", text: "Orders inside India usually leave within 2–3 days." },
          ].map((item) => (
            <article key={item.step} className="flex gap-4">
              <span className="font-display text-3xl text-sky">{item.step}</span>
              <div>
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <p className="mt-2 text-base leading-7 text-muted">{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="why-us" className="scroll-mt-24 bg-pillow">
        <div className="mx-auto grid max-w-[1240px] gap-10 px-4 py-16 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky">Why us</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">A catalog you can order from</h2>
            <p className="mt-4 max-w-xl text-lg leading-8 text-muted">
              Price, stock, and photographs come from the same product record. Prepaid takes the store discount. Cash on delivery is available across India.
            </p>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2">
            {[
              { title: "Specified watches", text: "Movement, case, strap, dial, and water resistance sit on every product page." },
              { title: "Insured shipping", text: "Free delivery inside India, usually in two to three days." },
              { title: "Prepaid or COD", text: "Pay before dispatch for the discount, or pay when the parcel arrives." },
              { title: "48-hour returns", text: "Report a damaged or wrong item with photos of the parcel." },
            ].map((item) => (
              <li key={item.title} className="bg-white p-6">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-base leading-7 text-muted">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="about" className="mx-auto grid max-w-[1240px] items-center gap-10 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky">About us</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">A Mumbai desk for Swiss watches</h2>
          <p className="mt-4 text-lg leading-8 text-muted">
            Swiss World Watch is built around a live catalog rather than a static brochure. House lines cover steel sports watches, chronographs, dress pieces, and smaller quartz cases.
          </p>
          <p className="mt-4 text-lg leading-8 text-muted">
            WhatsApp the desk, visit the showroom notes on the footer, or open a watch and order from the product page.
          </p>
          <Link href="/about" className="btn-sky mt-8">
            Read more
          </Link>
        </div>
        <div className="relative min-h-[280px] overflow-hidden bg-ink sm:min-h-[360px]">
          <Image src={settings.heroImage} alt="Swiss World Watch studio piece" fill className="object-cover opacity-90" sizes="(max-width: 1024px) 100vw, 45vw" />
        </div>
      </section>

      <section className="bg-pillow">
        <div className="mx-auto max-w-[1240px] px-4 py-16">
          <SectionHeading href="/watches" action="View all">
            Brands
          </SectionHeading>
          <BrandMarquee brands={brands} />
          <h3 className="mt-12 text-2xl font-semibold tracking-tight">Shop by category</h3>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/watches/${category.slug}`}
                className="group block border border-ink/10 bg-white hover:border-sky"
              >
                <div className="relative aspect-square overflow-hidden bg-neutral-100">
                  <CategoryImage src={category.imageUrl} name={category.name} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px" />
                </div>
                <span className="block px-3 py-2.5 text-center text-base group-hover:text-sky">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-4 py-16">
        <SectionHeading href="/watches" action="View all">
          Signature product
        </SectionHeading>
        <div className="grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
          {signature.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="bg-pillow">
        <div className="mx-auto max-w-[1240px] px-4 py-16">
          <SectionHeading href="/watches?sale=1" action="View sale">
            Discount
          </SectionHeading>
          <div className="grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
            {discounts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-4 py-16">
        <SectionHeading href="/watches">Rice collection</SectionHeading>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {brands.map((brand) => (
            <Link key={`rice-${brand.id}`} href={`/watches/${brand.slug}`} className="border border-line px-4 py-8 text-center hover:border-sky">
              <span className="block font-script text-3xl">{brand.name}</span>
              <span className="mt-2 block text-base text-muted">Shop {brand.name}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

function SectionHeading({
  children,
  href,
  action = "Shop",
  light = false,
}: {
  children: React.ReactNode;
  href?: string;
  action?: string;
  light?: boolean;
}) {
  return (
    <div className="mb-10 flex items-end justify-between gap-4">
      <h2 className={`text-3xl font-semibold tracking-tight sm:text-4xl ${light ? "text-white" : "text-ink"}`}>{children}</h2>
      {href && (
        <Link href={href} className={`shrink-0 text-base font-medium hover:underline ${light ? "text-[#d4b06a]" : "text-sky"}`}>
          {action}
        </Link>
      )}
    </div>
  );
}

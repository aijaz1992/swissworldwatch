import { Gallery } from "@/components/store/gallery";
import { ProductGrid } from "@/components/store/product-card";
import { PurchaseBox } from "@/components/store/purchase-box";
import { specRows, type ProductCardData, type ProductDetail } from "@/lib/catalog";
import { absoluteUrl, discountPercent, formatMoney, type Currency } from "@/lib/format";
import Link from "next/link";

export function ProductDetailView({
  product,
  related,
  currency,
}: {
  product: ProductDetail;
  related: ProductCardData[];
  currency: Currency;
}) {
  const discount = discountPercent(product.price, product.compareAtPrice);
  const specs = specRows(product);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    image: product.images.map((image) => absoluteUrl(image.url)),
    brand: { "@type": "Brand", name: product.brand.name },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: absoluteUrl(`/watches/${product.slug}`),
    },
  };

  return (
    <article className="mx-auto max-w-[1240px] px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <nav className="mb-6 text-sm text-neutral-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-sky">
          Home
        </Link>
        <span> / </span>
        <Link href="/watches" className="hover:text-sky">
          Watches
        </Link>
        <span> / </span>
        <Link href={`/watches/${product.brand.slug}`} className="hover:text-sky">
          {product.brand.name}
        </Link>
        <span> / </span>
        <span className="text-neutral-800">{product.name}</span>
      </nav>
      <div className="grid items-start gap-10 lg:grid-cols-2">
        <Gallery images={product.images} name={product.name} />
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-sky">
            <Link href={`/watches/${product.brand.slug}`}>{product.brand.name}</Link>
          </p>
          <h1 className="mt-2 text-2xl font-bold leading-snug text-neutral-950 sm:text-3xl">{product.name}</h1>
          <p className="mt-4 text-sm">
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="mr-3 text-lg text-neutral-400 line-through">{formatMoney(product.compareAtPrice, currency)}</span>
            )}
            <span className="text-3xl font-semibold text-sky">{formatMoney(product.price, currency)}</span>
            {discount && <span className="ml-3 bg-sale px-2 py-1 text-xs font-semibold text-white">Save {discount}%</span>}
          </p>
          <p className={`mt-3 text-sm font-medium ${product.stock > 0 ? "text-emerald-700" : "text-sale"}`}>
            {product.stock > 0 ? `In stock · ${product.stock} available` : "Out of stock"}
          </p>
          <p className="mt-1 text-xs text-neutral-500">SKU {product.sku}</p>
          <p className="mt-5 text-sm leading-7 text-neutral-700">{product.description}</p>
          <PurchaseBox productId={product.id} stock={product.stock} />
        </div>
      </div>

      <section className="mt-14">
        <h2 className="text-xl font-bold">Specifications</h2>
        <dl className="mt-4 divide-y divide-neutral-200 border border-neutral-200">
          {specs.map(([label, value]) => (
            <div key={label} className="grid grid-cols-1 gap-1 px-4 py-3 text-sm sm:grid-cols-[220px_1fr]">
              <dt className="font-medium text-neutral-500">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {product.details && (
        <section className="mt-12 max-w-3xl">
          <h2 className="text-xl font-bold">Product details</h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-neutral-700">{product.details}</p>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-8 text-center text-xl font-semibold uppercase tracking-wide text-sky">Similar watches</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </article>
  );
}

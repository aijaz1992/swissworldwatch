import { addToCart } from "@/actions/store";
import { discountPercent, formatMoney } from "@/lib/format";
import { primaryImage, type ProductCardData } from "@/lib/catalog";
import { getCurrency } from "@/lib/settings";
import Image from "next/image";
import Link from "next/link";
import { SubmitButton } from "@/components/store/submit-button";

export async function ProductCard({ product }: { product: ProductCardData }) {
  const currency = await getCurrency();
  const image = primaryImage(product);
  const discount = discountPercent(product.price, product.compareAtPrice);
  const inStock = product.stock > 0;

  return (
    <article className="text-center">
      <Link href={`/watches/${product.slug}`} className="group block">
        <div className="relative aspect-square overflow-hidden bg-neutral-100">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover transition duration-300 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="grid h-full place-items-center text-sm text-neutral-400">No image</div>
          )}
          {!inStock && (
            <span className="absolute left-2 top-2 bg-sale px-1.5 py-0.5 text-[11px] lowercase text-white">out of stock</span>
          )}
          <span className="absolute right-2 top-2 flex flex-col items-end gap-1">
            {product.bestSeller && <span className="bg-neutral-950 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-white">Best Seller</span>}
            {product.isNew && <span className="bg-sky px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-white">New</span>}
            {discount && <span className="bg-sale px-1.5 py-0.5 text-[10px] font-semibold text-white">-{discount}%</span>}
          </span>
        </div>
        <h3 className="mt-3 min-h-[3.4em] text-base leading-snug text-neutral-800 group-hover:text-sky">{product.name}</h3>
        <p className="mt-1 text-base">
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="mr-2 text-neutral-400 line-through">{formatMoney(product.compareAtPrice, currency)}</span>
          )}
          <span className="font-semibold text-sky">{formatMoney(product.price, currency)}</span>
        </p>
      </Link>
      <div className="mt-3">
        {inStock ? (
          <form action={addToCart}>
            <input type="hidden" name="productId" value={product.id} />
            <input type="hidden" name="quantity" value="1" />
            <SubmitButton className="btn-sky min-w-[118px]" pendingLabel="Adding…">
              Add to cart
            </SubmitButton>
          </form>
        ) : (
          <Link href={`/watches/${product.slug}`} className="btn-sky min-w-[118px]">
            Read more
          </Link>
        )}
      </div>
    </article>
  );
}

export function ProductGrid({ products }: { products: ProductCardData[] }) {
  if (products.length === 0) {
    return (
      <div className="border border-dashed border-neutral-300 px-6 py-16 text-center">
        <p className="text-lg font-semibold">No watches match these filters</p>
        <p className="mt-2 text-sm text-neutral-500">Try another brand, price range, or clear the search.</p>
        <Link href="/watches" className="btn-sky mt-5">
          Browse all watches
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

import { removeCartItem, updateCartItem } from "@/actions/store";
import { getCart } from "@/lib/cart";
import { formatMoney } from "@/lib/format";
import { getCurrency } from "@/lib/settings";
import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "Cart" };

export default async function CartPage() {
  const [cart, currency] = await Promise.all([getCart(), getCurrency()]);
  const items = cart?.items ?? [];
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="mx-auto max-w-[1000px] px-4 py-10">
      <h1 className="text-3xl font-bold">Cart</h1>
      {items.length === 0 ? (
        <div className="mt-8 border border-dashed border-neutral-300 px-6 py-16 text-center">
          <p className="text-lg font-semibold">Your cart is empty</p>
          <Link href="/watches" className="btn-sky mt-5">
            Browse watches
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          <ul className="divide-y divide-neutral-200 border border-neutral-200">
            {items.map((item) => {
              const image = item.product.images[0]?.url;
              const overStock = item.quantity > item.product.stock || item.product.status !== "ACTIVE";
              return (
                <li key={item.id} className="grid gap-4 p-4 sm:grid-cols-[96px_1fr_auto]">
                  <Link href={`/watches/${item.product.slug}`} className="relative h-24 w-24 overflow-hidden bg-neutral-100">
                    {image && <Image src={image} alt="" fill className="object-cover" sizes="96px" />}
                  </Link>
                  <div>
                    <Link href={`/watches/${item.product.slug}`} className="font-medium hover:text-sky">
                      {item.product.name}
                    </Link>
                    <p className="mt-1 text-sm text-neutral-500">{item.product.brand.name}</p>
                    <p className="mt-1 text-sm font-semibold text-sky">{formatMoney(item.product.price, currency)}</p>
                    {overStock && <p className="mt-1 text-sm text-sale">Only {item.product.stock} left. Update the quantity before checkout.</p>}
                    <form action={updateCartItem} className="mt-3 flex items-center gap-2">
                      <input type="hidden" name="itemId" value={item.id} />
                      <label className="text-sm" htmlFor={`qty-${item.id}`}>
                        Qty
                      </label>
                      <input
                        id={`qty-${item.id}`}
                        name="quantity"
                        type="number"
                        min={1}
                        max={Math.max(item.product.stock, 1)}
                        defaultValue={item.quantity}
                        className="input w-20"
                      />
                      <button className="text-sm text-sky">Update</button>
                    </form>
                  </div>
                  <form action={removeCartItem}>
                    <input type="hidden" name="itemId" value={item.id} />
                    <button className="text-sm text-sale">Remove</button>
                  </form>
                </li>
              );
            })}
          </ul>
          <aside className="h-fit border border-neutral-200 p-5">
            <h2 className="font-semibold">Summary</h2>
            <p className="mt-4 flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatMoney(subtotal, currency)}</span>
            </p>
            <p className="mt-2 text-xs text-neutral-500">Shipping is free. The prepaid discount is applied at checkout.</p>
            <Link href="/checkout" className="btn-sky mt-5 w-full">
              Checkout
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}

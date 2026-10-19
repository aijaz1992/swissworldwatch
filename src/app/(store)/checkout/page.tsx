import { CheckoutForm } from "@/components/store/checkout-form";
import { getCurrentUser } from "@/lib/auth";
import { getCart } from "@/lib/cart";
import { getCurrency, getSettings } from "@/lib/settings";
import Link from "next/link";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const [cart, settings, currency, user] = await Promise.all([getCart(), getSettings(), getCurrency(), getCurrentUser()]);
  const items = (cart?.items ?? []).filter((item) => item.product.status === "ACTIVE");

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-10">
      <h1 className="text-3xl font-bold">Checkout</h1>
      {items.length === 0 ? (
        <div className="mt-8 border border-dashed border-neutral-300 px-6 py-16 text-center">
          <p className="text-lg font-semibold">Nothing to check out yet</p>
          <Link href="/watches" className="btn-sky mt-5">
            Browse watches
          </Link>
        </div>
      ) : (
        <div className="mt-8">
          <CheckoutForm
            currency={currency}
            discountPercent={settings.prepaidDiscount}
            email={user?.email}
            name={user?.name}
            items={items.map((item) => ({
              name: item.product.name,
              quantity: item.quantity,
              price: item.product.price,
            }))}
          />
        </div>
      )}
    </div>
  );
}

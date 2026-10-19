"use client";

import { addToCart, buyNow } from "@/actions/store";
import { SubmitButton } from "@/components/store/submit-button";
import { useState } from "react";

export function PurchaseBox({ productId, stock }: { productId: string; stock: number }) {
  const [quantity, setQuantity] = useState(1);

  if (stock < 1) {
    return <p className="mt-4 inline-block bg-sale px-3 py-2 text-sm text-white">Out of stock</p>;
  }

  return (
    <form action={addToCart} className="mt-5 space-y-4">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="quantity" value={quantity} />
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Quantity</span>
        <div className="inline-flex border border-neutral-300">
          <button type="button" className="px-3 py-1.5" aria-label="Decrease quantity" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
            −
          </button>
          <span className="grid min-w-10 place-items-center border-x border-neutral-300 text-sm">{quantity}</span>
          <button
            type="button"
            className="px-3 py-1.5"
            aria-label="Increase quantity"
            onClick={() => setQuantity((value) => Math.min(stock, value + 1))}
          >
            +
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <SubmitButton className="btn-sky px-8 py-2.5" pendingLabel="Adding…">
          Add to cart
        </SubmitButton>
        <button
          formAction={buyNow}
          className="border border-neutral-900 px-8 py-2.5 text-sm font-medium hover:bg-neutral-950 hover:text-white"
        >
          Buy now
        </button>
      </div>
      <p className="text-xs text-neutral-500">Express dispatch in 2–3 days. Prepaid orders receive the store discount at checkout.</p>
    </form>
  );
}

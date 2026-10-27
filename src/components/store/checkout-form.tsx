"use client";

import { placeOrder, type FormState } from "@/actions/store";
import { SubmitButton } from "@/components/store/submit-button";
import { UpiPaymentPanel } from "@/components/store/upi-payment";
import { formatMoney, type Currency } from "@/lib/format";
import { useActionState, useState } from "react";

export function CheckoutForm({
  items,
  discountPercent,
  currency,
  email,
  name,
}: {
  items: { name: string; quantity: number; price: number }[];
  discountPercent: number;
  currency: Currency;
  email?: string;
  name?: string;
}) {
  const [state, action] = useActionState<FormState, FormData>(placeOrder, {});
  const [method, setMethod] = useState<"COD" | "PREPAID" | "UPI">("COD");
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = method === "PREPAID" || method === "UPI" ? Math.round((subtotal * discountPercent) / 100) : 0;

  return (
    <form action={action} className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4">
        {state.error && (
          <p role="alert" className="border border-sale bg-red-50 px-3 py-2 text-sm text-sale">
            {state.error}
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" name="fullName" defaultValue={name} autoComplete="name" />
          <Field label="Email" name="email" type="email" defaultValue={email} autoComplete="email" />
          <Field label="Phone" name="phone" autoComplete="tel" />
          <Field label="PIN code" name="postalCode" autoComplete="postal-code" />
        </div>
        <Field label="Address" name="line1" autoComplete="address-line1" />
        <Field label="Apartment, area (optional)" name="line2" autoComplete="address-line2" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="City" name="city" autoComplete="address-level2" />
          <Field label="State" name="state" autoComplete="address-level1" />
        </div>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Order notes</span>
          <textarea name="notes" rows={3} className="input" />
        </label>
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Payment</legend>
          <label className="flex items-start gap-2 border border-neutral-200 p-3 text-sm">
            <input type="radio" name="paymentMethod" value="COD" checked={method === "COD"} onChange={() => setMethod("COD")} />
            <span>Cash on delivery</span>
          </label>
          <label className="flex items-start gap-2 border border-neutral-200 p-3 text-sm">
            <input type="radio" name="paymentMethod" value="PREPAID" checked={method === "PREPAID"} onChange={() => setMethod("PREPAID")} />
            <span>Prepaid — {discountPercent}% off (card or netbanking)</span>
          </label>
          <label className={`flex items-start gap-2 border p-3 text-sm ${method === "UPI" ? "border-sky" : "border-neutral-200"}`}>
            <input type="radio" name="paymentMethod" value="UPI" checked={method === "UPI"} onChange={() => setMethod("UPI")} />
            <span>
              Pay via UPI / PhonePe QR — {discountPercent}% off
              <span className="block text-xs text-neutral-500">Scan & pay with PhonePe, Google Pay, Paytm, BHIM, or any UPI app.</span>
            </span>
          </label>
          {method === "UPI" && (
            <UpiPaymentPanel amount={subtotal - discount}>
              <label className="block text-sm">
                <span className="mb-1 block font-medium">UPI transaction ID / UTR</span>
                <input
                  className="input"
                  name="paymentReference"
                  inputMode="text"
                  autoComplete="off"
                  pattern="[A-Za-z0-9]{8,30}"
                  title="8–30 letters or digits, e.g. the 12-digit UTR from your UPI receipt"
                  placeholder="e.g. 412345678901"
                />
                <span className="mt-1 block text-xs text-neutral-500">
                  Paid already? Enter the UTR now. Otherwise place the order and add it on the next page. We dispatch once the payment is verified.
                </span>
              </label>
            </UpiPaymentPanel>
          )}
        </fieldset>
        <SubmitButton className="btn-sky w-full py-3" pendingLabel="Placing order…">
          {method === "UPI" ? "Place order & pay via UPI" : "Place order"}
        </SubmitButton>
      </div>
      <aside className="h-fit border border-neutral-200 p-5">
        <h2 className="font-semibold">Order summary</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {items.map((item) => (
            <li key={item.name} className="flex justify-between gap-4">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatMoney(item.price * item.quantity, currency)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-neutral-200 pt-4 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatMoney(subtotal, currency)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Shipping</dt>
            <dd>Free</dd>
          </div>
          <div className="flex justify-between text-emerald-700">
            <dt>{method === "UPI" ? "UPI prepaid discount" : "Prepaid discount"}</dt>
            <dd>{discount ? `−${formatMoney(discount, currency)}` : formatMoney(0, currency)}</dd>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <dt>Total</dt>
            <dd>{formatMoney(subtotal - discount, currency)}</dd>
          </div>
        </dl>
      </aside>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      <input className="input" name={name} type={type} defaultValue={defaultValue} autoComplete={autoComplete} required={name !== "line2" && name !== "notes"} />
    </label>
  );
}

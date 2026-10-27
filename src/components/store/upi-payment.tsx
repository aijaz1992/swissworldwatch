"use client";

import { formatMoney } from "@/lib/format";
import { UPI_ID, UPI_PAYEE, UPI_QR_FULL_IMAGE, UPI_QR_IMAGE, upiPayLink } from "@/lib/payment";
import Image from "next/image";
import { useState } from "react";

/** Scan-and-pay panel: PhonePe/UPI QR, exact amount, and step-by-step instructions. */
export function UpiPaymentPanel({
  amount,
  orderNumber,
  children,
}: {
  amount: number;
  orderNumber?: string;
  children?: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const amountLabel = formatMoney(amount, "INR");

  async function copyUpiId() {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="border border-[#d4b06a]/60 bg-pillow p-4 sm:p-5">
      <div className="grid gap-5 sm:grid-cols-[220px_1fr]">
        <div className="mx-auto w-full max-w-[220px] bg-white p-3 shadow-sm">
          <Image
            src={UPI_QR_IMAGE}
            width={707}
            height={860}
            alt={`UPI QR code to pay ${UPI_PAYEE}`}
            sizes="220px"
            className="h-auto w-full"
          />
          <a href={UPI_QR_FULL_IMAGE} download="swiss-world-watch-upi-qr.png" className="mt-2 block text-center text-xs text-sky underline">
            Download QR
          </a>
        </div>
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky">Amount to pay</p>
            <p className="font-display text-3xl tracking-wide text-ink">{amountLabel}</p>
            {orderNumber && (
              <p className="text-xs text-neutral-600">
                Add <span className="font-semibold text-ink">{orderNumber}</span> in the payment note.
              </p>
            )}
          </div>
          <dl className="space-y-1 text-neutral-700">
            <div className="flex flex-wrap gap-x-2">
              <dt className="text-neutral-500">Payee</dt>
              <dd className="font-medium">{UPI_PAYEE}</dd>
            </div>
            <div className="flex flex-wrap items-center gap-x-2">
              <dt className="text-neutral-500">UPI ID</dt>
              <dd className="font-medium">{UPI_ID}</dd>
              <button type="button" onClick={copyUpiId} className="text-xs text-sky underline">
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </dl>
          <ol className="list-decimal space-y-1 pl-5 text-neutral-700">
            <li>Open PhonePe, Google Pay, Paytm, BHIM, or any UPI app.</li>
            <li>Scan this QR code (or pay to the UPI ID above).</li>
            <li>
              Enter exactly <span className="font-semibold text-ink">{amountLabel}</span> and complete the payment.
            </li>
            <li>Copy the 12-digit UTR / transaction ID from the payment receipt and confirm it below.</li>
          </ol>
          <a href={upiPayLink(amount, orderNumber ? `Order ${orderNumber}` : "Swiss World Watch order")} className="btn-outline px-4 py-2 text-sm sm:hidden">
            Pay {amountLabel} in a UPI app
          </a>
        </div>
      </div>
      {children && <div className="mt-4 border-t border-[#d4b06a]/40 pt-4">{children}</div>}
    </div>
  );
}

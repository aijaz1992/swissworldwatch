"use client";

import { submitUpiReference } from "@/actions/store";
import { SubmitButton } from "@/components/store/submit-button";
import { useActionState } from "react";

export function UpiReferenceForm({ orderNumber, defaultValue }: { orderNumber: string; defaultValue?: string | null }) {
  const [state, action] = useActionState(submitUpiReference, {});

  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="orderNumber" value={orderNumber} />
      <label className="block text-sm">
        <span className="mb-1 block font-medium">I&apos;ve paid — UPI transaction ID / UTR</span>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            className="input"
            name="paymentReference"
            required
            autoComplete="off"
            pattern="[A-Za-z0-9]{8,30}"
            title="8–30 letters or digits, e.g. the 12-digit UTR from your UPI receipt"
            placeholder="e.g. 412345678901"
            defaultValue={defaultValue ?? undefined}
          />
          <SubmitButton className="btn-sky whitespace-nowrap px-5" pendingLabel="Saving…">
            Confirm payment
          </SubmitButton>
        </div>
      </label>
      {state.error && (
        <p role="alert" className="text-sm text-sale">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p role="status" className="text-sm text-emerald-700">
          Thanks! We&apos;ve received your UTR and will confirm the order once the payment is verified.
        </p>
      )}
    </form>
  );
}

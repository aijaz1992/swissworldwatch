"use client";

import type { FormState } from "@/actions/admin";
import { SubmitButton } from "@/components/store/submit-button";
import { useActionState } from "react";

export function TaxonomyForm({
  action,
  label,
  featured,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  label: string;
  featured?: boolean;
}) {
  const [state, formAction] = useActionState(action, {});
  return (
    <form action={formAction} className="mt-4 space-y-2">
      {state.error && <p className="text-sm text-sale">{state.error}</p>}
      {state.ok && <p className="text-sm text-emerald-700">Saved.</p>}
      <input className="input" name="name" placeholder={label} required />
      <input className="input" name="description" placeholder="Short description" />
      {featured && (
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" /> Show on the homepage
        </label>
      )}
      <SubmitButton className="btn-sky" pendingLabel="Saving…">
        Add
      </SubmitButton>
    </form>
  );
}

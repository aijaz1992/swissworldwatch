"use client";

import { updateSettings, type FormState } from "@/actions/admin";
import { SubmitButton } from "@/components/store/submit-button";
import { prepareImageUploads } from "@/lib/client-images";
import { useActionState } from "react";

export function SettingsForm({ values }: { values: Record<string, string> }) {
  const [state, action] = useActionState<FormState, FormData>(async (prev, formData) => {
    const tooLarge = await prepareImageUploads(formData, ["heroImageFile"]);
    if (tooLarge) return { error: tooLarge };
    return updateSettings(prev, formData);
  }, {});
  return (
    <form action={action} className="space-y-4 bg-white p-5 shadow-sm">
      {state.error && <p className="text-sm text-sale">{state.error}</p>}
      {state.ok && <p className="text-sm text-emerald-700">Settings saved. The storefront is using the new copy.</p>}
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Promo bar" name="promoText" defaultValue={values.promoText} />
        <Field label="Phone" name="phone" defaultValue={values.phone} />
        <Field label="Hours" name="hours" defaultValue={values.hours} />
        <Field label="Email" name="email" defaultValue={values.email} />
        <Field label="WhatsApp number" name="whatsapp" defaultValue={values.whatsapp} />
        <Field label="Telegram URL" name="telegram" defaultValue={values.telegram} />
        <Field label="Prepaid discount %" name="prepaidDiscount" defaultValue={values.prepaidDiscount} type="number" />
        <Field label="Showroom address" name="address" defaultValue={values.address} />
        <Field label="Hero title" name="heroTitle" defaultValue={values.heroTitle} />
        <Field label="Hero line 2" name="heroLine2" defaultValue={values.heroLine2} />
        <Field label="Hero line 3" name="heroLine3" defaultValue={values.heroLine3} />
      </div>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Footer description</span>
        <textarea name="storeBlurb" rows={3} defaultValue={values.storeBlurb} className="input" />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Hero image</span>
        <input type="hidden" name="heroImage" value={values.heroImage} />
        <input type="file" name="heroImageFile" accept="image/jpeg,image/png,image/webp" className="mt-1 text-sm" />
      </label>
      <SubmitButton className="btn-sky" pendingLabel="Saving…">
        Save settings
      </SubmitButton>
    </form>
  );
}

function Field({ label, name, defaultValue, type = "text" }: { label: string; name: string; defaultValue: string; type?: string }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      <input className="input" name={name} type={type} defaultValue={defaultValue} />
    </label>
  );
}

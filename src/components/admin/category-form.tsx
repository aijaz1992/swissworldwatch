"use client";

import type { FormState } from "@/actions/admin";
import { SubmitButton } from "@/components/store/submit-button";
import { prepareImageUploads } from "@/lib/client-images";
import { useActionState } from "react";

type Category = { id: string; name: string; description: string; imageUrl: string | null; sortOrder: number };

export function CategoryForm({
  action,
  category,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  category?: Category;
}) {
  const [state, formAction] = useActionState<FormState, FormData>(async (prev, formData) => {
    const tooLarge = await prepareImageUploads(formData, ["imageFile"]);
    if (tooLarge) return { error: tooLarge };
    return action(prev, formData);
  }, {});
  const external = category?.imageUrl && !category.imageUrl.startsWith("/media/") ? category.imageUrl : "";
  return (
    <form action={formAction} className="mt-3 space-y-2">
      {state.error && <p className="text-sm text-sale">{state.error}</p>}
      {state.ok && <p className="text-sm text-emerald-700">Saved.</p>}
      {category && <input type="hidden" name="id" value={category.id} />}
      <input className="input" name="name" placeholder="Category name" defaultValue={category?.name} required />
      <input className="input" name="description" placeholder="Short description" defaultValue={category?.description} />
      {category && (
        <label className="flex items-center gap-2 text-sm">
          Order
          <input className="input w-20" type="number" name="sortOrder" defaultValue={category.sortOrder} />
        </label>
      )}
      <label className="block text-sm">
        Image (JPG, PNG or WebP, up to 5 MB)
        <input type="file" name="imageFile" accept="image/jpeg,image/png,image/webp" className="mt-1 block text-sm" />
      </label>
      <input className="input" name="imageUrl" placeholder="…or paste an image link (https://)" defaultValue={external} />
      {category?.imageUrl && (
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="removeImage" /> Remove image
        </label>
      )}
      <SubmitButton className="btn-sky" pendingLabel="Saving…">
        {category ? "Save" : "Add"}
      </SubmitButton>
    </form>
  );
}

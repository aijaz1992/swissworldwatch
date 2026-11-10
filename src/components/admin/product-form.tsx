"use client";

import { createProduct, updateProduct, type FormState } from "@/actions/admin";
import { SubmitButton } from "@/components/store/submit-button";
import { prepareImageUploads } from "@/lib/client-images";
import Image from "next/image";
import { useActionState, useState } from "react";

type Option = { id: string; name: string };

type ProductInput = {
  id: string;
  name: string;
  sku: string;
  brandId: string;
  categoryId: string;
  collectionId: string | null;
  description: string;
  details: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  gender: "MEN" | "WOMEN" | "UNISEX";
  status: "ACTIVE" | "DRAFT" | "ARCHIVED";
  movement: string | null;
  caseMaterial: string | null;
  strapMaterial: string | null;
  dialColor: string | null;
  caseSize: string | null;
  waterResistance: string | null;
  featured: boolean;
  bestSeller: boolean;
  isNew: boolean;
  slug: string;
  images: { id: string; url: string; isPrimary: boolean }[];
  specs: { label: string; value: string }[];
};

export function ProductForm({
  brands,
  categories,
  collections,
  product,
}: {
  brands: Option[];
  categories: Option[];
  collections: Option[];
  product?: ProductInput;
}) {
  const action = product ? updateProduct : createProduct;
  const [state, formAction] = useActionState<FormState, FormData>(async (prev, formData) => {
    const tooLarge = await prepareImageUploads(formData, ["images"]);
    if (tooLarge) return { error: tooLarge };
    return action(prev, formData);
  }, {});
  const [specs, setSpecs] = useState(product?.specs.length ? product.specs : [{ label: "", value: "" }]);

  return (
    <form action={formAction} className="space-y-6">
      {product && <input type="hidden" name="id" value={product.id} />}
      {state.error && (
        <p role="alert" className="border border-sale bg-red-50 px-3 py-2 text-sm text-sale">
          {state.error}
        </p>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Product name" name="name" defaultValue={product?.name} required />
        <Field label="SKU" name="sku" defaultValue={product?.sku} required />
        <Select label="Brand" name="brandId" defaultValue={product?.brandId ?? ""} options={brands} />
        <Select label="Category" name="categoryId" defaultValue={product?.categoryId ?? ""} options={categories} />
        <Select
          label="Collection"
          name="collectionId"
          defaultValue={product?.collectionId ?? ""}
          options={collections}
          optional
        />
        <Select
          label="Gender"
          name="gender"
          defaultValue={product?.gender ?? "UNISEX"}
          options={[
            { id: "MEN", name: "Men" },
            { id: "WOMEN", name: "Women" },
            { id: "UNISEX", name: "Unisex" },
          ]}
        />
        <Select
          label="Status"
          name="status"
          defaultValue={product?.status ?? "ACTIVE"}
          options={[
            { id: "ACTIVE", name: "Active — visible on the store" },
            { id: "DRAFT", name: "Hidden" },
            { id: "ARCHIVED", name: "Archived" },
          ]}
        />
        <Field label="Price (INR)" name="price" type="number" defaultValue={product ? String(product.price) : ""} required />
        <Field label="Compare-at price" name="compareAtPrice" type="number" defaultValue={product?.compareAtPrice ? String(product.compareAtPrice) : ""} />
        <Field label="Stock" name="stock" type="number" defaultValue={product ? String(product.stock) : "0"} required />
        <Field label="Movement" name="movement" defaultValue={product?.movement ?? ""} />
        <Field label="Case material" name="caseMaterial" defaultValue={product?.caseMaterial ?? ""} />
        <Field label="Strap / bracelet" name="strapMaterial" defaultValue={product?.strapMaterial ?? ""} />
        <Field label="Dial color" name="dialColor" defaultValue={product?.dialColor ?? ""} />
        <Field label="Case size" name="caseSize" defaultValue={product?.caseSize ?? ""} />
        <Field label="Water resistance" name="waterResistance" defaultValue={product?.waterResistance ?? ""} />
      </div>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Description</span>
        <textarea name="description" required rows={4} defaultValue={product?.description} className="input" />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Details</span>
        <textarea name="details" rows={5} defaultValue={product?.details} className="input" />
      </label>
      <div className="flex flex-wrap gap-4 text-sm">
        <Check name="featured" label="Featured" defaultChecked={product?.featured} />
        <Check name="bestSeller" label="Best seller" defaultChecked={product?.bestSeller} />
        <Check name="isNew" label="New" defaultChecked={product?.isNew} />
        {product && <Check name="regenerateSlug" label={`Refresh URL (current: /watches/${product.slug})`} />}
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold">Specifications</legend>
        {specs.map((spec, index) => (
          <div key={index} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
            <input className="input" name="specLabel" placeholder="Label" value={spec.label} onChange={(event) => updateSpec(index, "label", event.target.value)} />
            <input className="input" name="specValue" placeholder="Value" value={spec.value} onChange={(event) => updateSpec(index, "value", event.target.value)} />
            <button type="button" className="text-sm text-sale" onClick={() => setSpecs((rows) => rows.filter((_, row) => row !== index))}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" className="text-sm text-sky" onClick={() => setSpecs((rows) => [...rows, { label: "", value: "" }])}>
          Add specification
        </button>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold">Images</legend>
        <p className="mt-1 text-xs text-neutral-500">
          JPG, PNG, or WebP, up to 5MB. Files are stored in the database. The first image is the main photo unless you pick another. To replace a photo, upload the new file and tick Remove on the old one, then save.
        </p>
        {product && product.images.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {product.images.map((image) => (
              <label key={image.id} className="border border-neutral-200 p-2 text-xs">
                <span className="relative block aspect-square overflow-hidden bg-neutral-100">
                  <Image src={image.url} alt="" fill className="object-cover" sizes="160px" />
                </span>
                <span className="mt-2 flex items-center gap-2">
                  <input type="radio" name="primaryImage" value={image.id} defaultChecked={image.isPrimary} /> Main
                </span>
                <span className="mt-1 flex items-center gap-2">
                  <input type="checkbox" name="deleteImage" value={image.id} /> Remove
                </span>
              </label>
            ))}
          </div>
        )}
        <input className="mt-3 block text-sm" type="file" name="images" accept="image/jpeg,image/png,image/webp" multiple />
      </fieldset>

      <SubmitButton className="btn-sky px-6 py-2.5" pendingLabel="Saving…">
        {product ? "Save watch" : "Add watch"}
      </SubmitButton>
    </form>
  );

  function updateSpec(index: number, key: "label" | "value", value: string) {
    setSpecs((rows) => rows.map((row, rowIndex) => (rowIndex === index ? { ...row, [key]: value } : row)));
  }
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      <input className="input" name={name} type={type} defaultValue={defaultValue} required={required} min={type === "number" ? 0 : undefined} />
    </label>
  );
}

function Select({
  label,
  name,
  defaultValue,
  options,
  optional,
}: {
  label: string;
  name: string;
  defaultValue: string;
  options: Option[];
  optional?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      <select className="input" name={name} defaultValue={defaultValue} required={!optional}>
        {optional && <option value="">None</option>}
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </label>
  );
}

function Check({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="inline-flex items-center gap-2">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} />
      {label}
    </label>
  );
}

"use server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { settingDefaults, type SettingKey } from "@/lib/settings";
import { uniquePublicSlug } from "@/lib/slug";
import { ImageUploadError, saveUploadedImages } from "@/lib/storage";
import type { Gender, OrderStatus, ProductStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { refreshCatalog } from "@/lib/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export type FormState = { error?: string; ok?: boolean };

function emptyToNull(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text ? text : null;
}

const productSchema = z.object({
  name: z.string().trim().min(3, "Enter a product name.").max(180),
  sku: z.string().trim().min(2, "Enter a SKU.").max(40),
  brandId: z.string().min(1, "Choose a brand."),
  categoryId: z.string().min(1, "Choose a category."),
  description: z.string().trim().min(20, "Add a description of at least 20 characters.").max(4000),
  details: z.string().trim().max(8000).optional(),
  price: z.coerce.number().int().positive("Price must be a whole rupee amount."),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative."),
  gender: z.enum(["MEN", "WOMEN", "UNISEX"]),
  status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]),
});

function readSpecs(formData: FormData) {
  const labels = formData.getAll("specLabel").map(String);
  const values = formData.getAll("specValue").map(String);
  return labels
    .map((label, index) => ({
      label: label.trim(),
      value: (values[index] ?? "").trim(),
      sortOrder: index,
    }))
    .filter((spec) => spec.label && spec.value);
}

function productData(parsed: z.infer<typeof productSchema>, formData: FormData) {
  const compareRaw = String(formData.get("compareAtPrice") ?? "").trim();
  let compareAtPrice: number | null = null;
  if (compareRaw) {
    const compare = Number(compareRaw);
    if (!Number.isInteger(compare) || compare <= 0) {
      return { error: "Compare-at price must be a whole rupee amount." as const };
    }
    if (compare <= parsed.price) {
      return { error: "Compare-at price must be higher than the selling price." as const };
    }
    compareAtPrice = compare;
  }

  return {
    data: {
      name: parsed.name,
      sku: parsed.sku.toUpperCase(),
      brandId: parsed.brandId,
      categoryId: parsed.categoryId,
      collectionId: emptyToNull(formData.get("collectionId")),
      description: parsed.description,
      details: parsed.details?.trim() ?? "",
      price: parsed.price,
      compareAtPrice,
      stock: parsed.stock,
      gender: parsed.gender as Gender,
      status: parsed.status as ProductStatus,
      movement: emptyToNull(formData.get("movement")),
      caseMaterial: emptyToNull(formData.get("caseMaterial")),
      strapMaterial: emptyToNull(formData.get("strapMaterial")),
      dialColor: emptyToNull(formData.get("dialColor")),
      caseSize: emptyToNull(formData.get("caseSize")),
      waterResistance: emptyToNull(formData.get("waterResistance")),
      featured: formData.get("featured") === "on",
      bestSeller: formData.get("bestSeller") === "on",
      isNew: formData.get("isNew") === "on",
    },
  };
}

async function syncImages(productId: string, formData: FormData, alt: string) {
  const deleteIds = formData.getAll("deleteImage").map(String);
  if (deleteIds.length) {
    await prisma.productImage.deleteMany({ where: { productId, id: { in: deleteIds } } });
  }

  const uploads = formData
    .getAll("images")
    .filter((entry): entry is File => entry instanceof File);
  const urls = await saveUploadedImages(uploads);
  if (urls.length) {
    const current = await prisma.productImage.count({ where: { productId } });
    await prisma.productImage.createMany({
      data: urls.map((url, index) => ({
        productId,
        url,
        alt,
        sortOrder: current + index,
        isPrimary: false,
      })),
    });
  }

  const images = await prisma.productImage.findMany({
    where: { productId },
    orderBy: { sortOrder: "asc" },
  });
  if (images.length === 0) return { error: "Add at least one product image." };

  const requested = String(formData.get("primaryImage") ?? "");
  const primary = images.find((image) => image.id === requested) ?? images[0];
  await prisma.productImage.updateMany({ where: { productId }, data: { isPrimary: false } });
  await prisma.productImage.update({ where: { id: primary.id }, data: { isPrimary: true } });
  return { error: undefined };
}

export async function createProduct(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const built = productData(parsed.data, formData);
  if ("error" in built && built.error) return { error: built.error };
  if (!built.data) return { error: "Could not read the product." };

  let createdId: string | null = null;
  try {
    const slug = await uniquePublicSlug(parsed.data.name);
    const product = await prisma.product.create({
      data: {
        ...built.data,
        slug,
        specs: { create: readSpecs(formData) },
      },
    });
    createdId = product.id;
    const images = await syncImages(product.id, formData, product.name);
    if (images.error) {
      await prisma.product.delete({ where: { id: product.id } });
      return { error: images.error };
    }
  } catch (error) {
    // Roll back the half-created watch (this request's own new row only) so a retry does not hit "SKU in use".
    if (createdId) await prisma.product.delete({ where: { id: createdId } }).catch(() => undefined);
    if (isUnique(error)) return { error: "That SKU or name is already in use." };
    if (error instanceof ImageUploadError) return { error: error.message };
    return unexpected("createProduct", error, "Could not save the watch. Please try again.");
  }

  refreshCatalog();
  redirect("/admin/products");
}

export async function updateProduct(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const built = productData(parsed.data, formData);
  if ("error" in built && built.error) return { error: built.error };

  if (!built.data) return { error: "Could not read the product." };

  try {
    const existing = await prisma.product.findUnique({ where: { id }, select: { id: true, slug: true } });
    if (!existing) return { error: "Product not found." };
    const slug =
      formData.get("regenerateSlug") === "on" ? await uniquePublicSlug(parsed.data.name, existing.id) : existing.slug;
    await prisma.product.update({
      where: { id },
      data: {
        ...built.data,
        slug,
        specs: { deleteMany: {}, create: readSpecs(formData) },
      },
    });
    const images = await syncImages(id, formData, parsed.data.name);
    if (images.error) return { error: images.error };
  } catch (error) {
    if (isUnique(error)) return { error: "That SKU is already in use." };
    if (error instanceof ImageUploadError) return { error: error.message };
    return unexpected("updateProduct", error, "Could not save the watch. Please try again.");
  }

  refreshCatalog();
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await prisma.product.delete({ where: { id } });
  refreshCatalog();
  redirect("/admin/products");
}

const nameSchema = z.object({
  name: z.string().trim().min(2, "Enter a name."),
  description: z.string().trim().optional(),
});

export async function createBrand(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = nameSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  try {
    const slug = await uniquePublicSlug(parsed.data.name);
    await prisma.brand.create({
      data: {
        name: parsed.data.name,
        slug,
        description: parsed.data.description ?? "",
        featured: formData.get("featured") === "on",
      },
    });
  } catch (error) {
    if (isUnique(error)) return { error: "That name is already in use." };
    return unexpected("createBrand", error);
  }
  refreshCatalog();
  return { ok: true };
}

export async function deleteBrand(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const count = await prisma.product.count({ where: { brandId: id } });
  if (count > 0) redirect("/admin/categories?error=in-use");
  await prisma.brand.delete({ where: { id } });
  refreshCatalog();
}

async function readCategoryImage(formData: FormData, current: string | null = null) {
  if (formData.get("removeImage") === "on") return null;
  const file = formData.get("imageFile");
  if (file instanceof File && file.size > 0) {
    const [url] = await saveUploadedImages([file]);
    if (url) return url;
  }
  const typed = String(formData.get("imageUrl") ?? "").trim();
  if (typed) {
    if (!typed.startsWith("/") && !/^https:\/\//i.test(typed)) {
      throw new ImageUploadError("Image link must start with https://");
    }
    return typed;
  }
  return current;
}

export async function createCategory(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = nameSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  let imageUrl: string | null;
  try {
    imageUrl = await readCategoryImage(formData);
  } catch (error) {
    if (error instanceof ImageUploadError) return { error: error.message };
    return unexpected("createCategory image", error, "Could not save the image. Please try again.");
  }
  try {
    const slug = await uniquePublicSlug(parsed.data.name);
    const last = await prisma.category.aggregate({ _max: { sortOrder: true } });
    await prisma.category.create({
      data: {
        name: parsed.data.name,
        slug,
        description: parsed.data.description ?? "",
        imageUrl,
        sortOrder: (last._max.sortOrder ?? 0) + 1,
      },
    });
  } catch (error) {
    if (isUnique(error)) return { error: "That name is already in use." };
    return unexpected("createCategory", error);
  }
  refreshCatalog();
  return { ok: true };
}

export async function updateCategory(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const parsed = nameSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  let existing: { imageUrl: string | null } | null;
  try {
    existing = await prisma.category.findUnique({ where: { id }, select: { imageUrl: true } });
  } catch (error) {
    return unexpected("updateCategory lookup", error);
  }
  if (!existing) return { error: "Category not found." };
  let imageUrl: string | null;
  try {
    imageUrl = await readCategoryImage(formData, existing.imageUrl);
  } catch (error) {
    if (error instanceof ImageUploadError) return { error: error.message };
    return unexpected("updateCategory image", error, "Could not save the image. Please try again.");
  }
  const sortOrder = Number.parseInt(String(formData.get("sortOrder") ?? ""), 10);
  try {
    await prisma.category.update({
      where: { id },
      data: {
        name: parsed.data.name,
        description: parsed.data.description ?? "",
        imageUrl,
        ...(Number.isFinite(sortOrder) ? { sortOrder } : {}),
      },
    });
  } catch (error) {
    return unexpected("updateCategory", error);
  }
  refreshCatalog();
  return { ok: true };
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) redirect("/admin/categories?error=in-use");
  await prisma.category.delete({ where: { id } });
  refreshCatalog();
}

export async function createCollection(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = nameSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  try {
    const slug = await uniquePublicSlug(parsed.data.name);
    await prisma.collection.create({
      data: { name: parsed.data.name, slug, description: parsed.data.description ?? "" },
    });
  } catch (error) {
    if (isUnique(error)) return { error: "That name is already in use." };
    return unexpected("createCollection", error);
  }
  refreshCatalog();
  return { ok: true };
}

export async function deleteCollection(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await prisma.collection.delete({ where: { id } });
  refreshCatalog();
}

export async function updateOrderStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const allowed: OrderStatus[] = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
  if (!allowed.includes(status as OrderStatus)) return;
  await prisma.order.update({ where: { id }, data: { status: status as OrderStatus } });
  revalidatePath("/admin/orders");
}

export async function updateSettings(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const discount = Number(formData.get("prepaidDiscount"));
  if (!Number.isInteger(discount) || discount < 0 || discount > 80) {
    return { error: "Prepaid discount must be a whole number from 0 to 80." };
  }

  const heroFile = formData.get("heroImageFile");
  let heroImage = String(formData.get("heroImage") ?? "");
  if (heroFile instanceof File && heroFile.size > 0) {
    try {
      const [uploaded] = await saveUploadedImages([heroFile]);
      if (uploaded) heroImage = uploaded;
    } catch (error) {
      if (error instanceof ImageUploadError) return { error: error.message };
      return unexpected("updateSettings image", error, "Could not save the hero image. Please try again.");
    }
  }

  const values: Record<SettingKey, string> = {
    ...settingDefaults,
    promoText: String(formData.get("promoText") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    hours: String(formData.get("hours") ?? ""),
    email: String(formData.get("email") ?? ""),
    address: String(formData.get("address") ?? ""),
    whatsapp: String(formData.get("whatsapp") ?? "").replace(/\D/g, ""),
    telegram: String(formData.get("telegram") ?? ""),
    prepaidDiscount: String(discount),
    heroTitle: String(formData.get("heroTitle") ?? ""),
    heroLine2: String(formData.get("heroLine2") ?? ""),
    heroLine3: String(formData.get("heroLine3") ?? ""),
    heroImage: heroImage || settingDefaults.heroImage,
    storeBlurb: String(formData.get("storeBlurb") ?? ""),
  };

  try {
    await prisma.$transaction(
      (Object.keys(values) as SettingKey[]).map((key) =>
        prisma.siteSetting.upsert({
          where: { key },
          update: { value: values[key] },
          create: { key, value: values[key] },
        }),
      ),
    );
  } catch (error) {
    return unexpected("updateSettings", error);
  }

  refreshCatalog();
  return { ok: true };
}

/** Logs an unexpected failure and returns a friendly form error instead of crashing the page. */
function unexpected(label: string, error: unknown, message = "Could not save. Please try again."): FormState {
  console.error(`[admin] ${label} failed`, error);
  return { error: message };
}

function isUnique(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

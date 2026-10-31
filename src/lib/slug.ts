import { prisma } from "@/lib/prisma";

function slugify(input: string) {
  const slug = input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return slug || "item";
}

async function isPublicSlugTaken(slug: string, exceptProductId?: string) {
  const [product, brand, category, collection] = await Promise.all([
    prisma.product.findUnique({ where: { slug }, select: { id: true } }),
    prisma.brand.findUnique({ where: { slug }, select: { id: true } }),
    prisma.category.findUnique({ where: { slug }, select: { id: true } }),
    prisma.collection.findUnique({ where: { slug }, select: { id: true } }),
  ]);

  if (brand || category || collection) return true;
  if (product && product.id !== exceptProductId) return true;
  return false;
}

export async function uniquePublicSlug(base: string, exceptProductId?: string) {
  const root = slugify(base);
  let slug = root;
  let n = 2;
  while (await isPublicSlugTaken(slug, exceptProductId)) {
    slug = `${root}-${n++}`;
  }
  return slug;
}

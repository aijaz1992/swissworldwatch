import type { PrismaClient } from "@prisma/client";
import { existsSync } from "fs";
import { readdir, readFile } from "fs/promises";
import path from "path";

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function persistLocalCatalogImages(prisma: PrismaClient) {
  const catalogDir = path.join(process.cwd(), "public", "catalog");
  if (!existsSync(catalogDir)) return;

  const remap = new Map<string, string>();
  const files = await readdir(catalogDir);

  for (const file of files) {
    const mimeType = MIME[path.extname(file).toLowerCase()];
    if (!mimeType) continue;

    const sourcePath = `/catalog/${file}`;
    const bytes = await readFile(path.join(catalogDir, file));
    const row = await prisma.mediaFile.upsert({
      where: { sourcePath },
      update: { bytes, mimeType, filename: file },
      create: { sourcePath, filename: file, mimeType, bytes },
    });
    remap.set(sourcePath, `/media/${row.id}`);
  }

  for (const [from, to] of remap) {
    await prisma.productImage.updateMany({ where: { url: from }, data: { url: to } });
    await prisma.brand.updateMany({ where: { imageUrl: from }, data: { imageUrl: to } });
    await prisma.category.updateMany({ where: { imageUrl: from }, data: { imageUrl: to } });
    await prisma.siteSetting.updateMany({ where: { key: "heroImage", value: from }, data: { value: to } });
  }
}

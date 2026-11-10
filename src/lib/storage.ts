import { prisma } from "@/lib/prisma";

const ALLOWED = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);

/** An expected, user-fixable upload problem (wrong type, too large). Safe to show to the admin. */
export class ImageUploadError extends Error {}

async function saveUploadedImage(file: File) {
  if (!file || file.size === 0) return null;
  const extension = ALLOWED.get(file.type);
  if (!extension) {
    throw new ImageUploadError("Use a JPG, PNG, or WebP image.");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new ImageUploadError("Images must be 5MB or smaller.");
  }

  const row = await prisma.mediaFile.create({
    data: {
      filename: `${crypto.randomUUID()}${extension}`,
      mimeType: file.type,
      bytes: Buffer.from(await file.arrayBuffer()),
    },
  });
  return `/media/${row.id}`;
}

export async function saveUploadedImages(files: File[]) {
  const urls: string[] = [];
  for (const file of files) {
    const url = await saveUploadedImage(file);
    if (url) urls.push(url);
  }
  return urls;
}

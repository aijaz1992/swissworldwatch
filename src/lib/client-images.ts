/**
 * Browser-side photo shrinking for admin uploads.
 *
 * Vercel rejects request bodies over ~4.5MB before the server action runs, which used to
 * crash the admin forms with "Something went wrong". Phone photos are often 3–8MB each,
 * so we resize them in the browser (longest side 1600px, WebP) before submitting.
 */

/** Total upload budget per form submit, kept under Vercel's 4.5MB request limit. */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

export async function shrinkImage(file: File, maxSide = 1600, quality = 0.85): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size < 700 * 1024) {
      bitmap.close();
      return file;
    }
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", quality));
    if (!blob || blob.size >= file.size || blob.type !== "image/webp") return file;
    return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.webp`, { type: "image/webp" });
  } catch {
    return file;
  }
}

/**
 * Shrinks every image in the given file fields of `formData` (in place).
 * Returns an error message when the photos are still too large to send in one request.
 */
export async function prepareImageUploads(formData: FormData, fields: string[]): Promise<string | null> {
  let total = 0;
  for (const field of fields) {
    const files = formData
      .getAll(field)
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);
    if (files.length === 0) continue;
    formData.delete(field);
    for (const file of files) {
      const small = await shrinkImage(file);
      total += small.size;
      formData.append(field, small);
    }
  }
  if (total > MAX_UPLOAD_BYTES) {
    return "These photos are too large to upload together. Upload fewer photos at a time (you can add more by editing later).";
  }
  return null;
}

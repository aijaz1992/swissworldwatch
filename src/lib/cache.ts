import { revalidatePath, unstable_cache, updateTag } from "next/cache";

/** Tag shared by every cached storefront read (products, brands, categories, settings). */
const CATALOG_TAG = "catalog";

/** Seconds before cached storefront data is refreshed in the background. */
const REVALIDATE_SECONDS = 300;

/**
 * Caches a read-only storefront query across requests.
 * Admin and checkout writes call `refreshCatalog()` so changes still show immediately.
 */
export function cached<Args extends unknown[], Result>(fn: (...args: Args) => Promise<Result>, key: string) {
  return unstable_cache(fn, [key], { tags: [CATALOG_TAG], revalidate: REVALIDATE_SECONDS });
}

/** Expire all cached storefront data and re-render pages. Call from server actions only. */
export function refreshCatalog() {
  updateTag(CATALOG_TAG);
  revalidatePath("/", "layout");
}

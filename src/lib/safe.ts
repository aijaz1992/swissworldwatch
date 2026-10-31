/** Resolve a data promise, falling back to a default instead of crashing the page. */
export async function safe<T>(promise: Promise<T>, fallback: T, label = "query"): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    console.error(`[safe] ${label} failed`, error);
    return fallback;
  }
}

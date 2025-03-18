/**
 * Helper functions for working with Convex
 */

/**
 * Safely converts a Convex ID to a string format that can be used in mutations
 * This helps resolve type issues when passing IDs between client and server
 */
export function convexIdToString(id: any): string {
  if (!id) return "";

  // If it's already a string, return it
  if (typeof id === "string") return id;

  // If it has a toString method (like Convex IDs do), use that
  if (id && typeof id.toString === "function") {
    return id.toString();
  }

  // Last resort, try JSON stringify
  try {
    return JSON.stringify(id);
  } catch (e) {
    console.error("Failed to convert ID", id, e);
    return "";
  }
}

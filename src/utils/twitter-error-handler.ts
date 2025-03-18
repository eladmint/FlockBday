/**
 * Utility functions for handling Twitter API errors
 */

/**
 * Parses Twitter API errors and returns a user-friendly message
 */
export function parseTwitterError(error: unknown): string {
  // If it's an Error object, use its message
  if (error instanceof Error) {
    const message = error.message;

    // Check for common Twitter API errors
    if (message.includes("401 Unauthorized")) {
      return "Twitter authentication failed. Please reconnect your account.";
    }

    if (message.includes("403 Forbidden")) {
      return "You don't have permission to perform this action on Twitter.";
    }

    if (message.includes("404 Not Found")) {
      return "The requested Twitter resource was not found.";
    }

    if (message.includes("429 Too Many Requests")) {
      return "Twitter rate limit exceeded. Please try again later.";
    }

    if (message.includes("500 Internal Server Error")) {
      return "Twitter is experiencing issues. Please try again later.";
    }

    if (message.includes("503 Service Unavailable")) {
      return "Twitter service is currently unavailable. Please try again later.";
    }

    if (message.includes("Twitter account not connected")) {
      return "Please connect your Twitter account in settings first.";
    }

    if (message.includes("Not authorized")) {
      return "You don't have permission to perform this action.";
    }

    if (message.includes("Invalid campaign ID")) {
      return "Invalid campaign ID format. Please try again.";
    }

    // Return the original message if no specific match
    return message;
  }

  // If it's not an Error object, convert to string
  return String(error || "Unknown error occurred");
}

/**
 * Logs Twitter errors with additional context
 */
export function logTwitterError(context: string, error: unknown): void {
  console.error(`Twitter Error (${context}):`, error);

  // You could add additional logging here, such as sending to a monitoring service
}

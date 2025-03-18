/**
 * Enhanced debug logger for Convex operations
 */

// Set to true to enable verbose logging
const VERBOSE_LOGGING = true;

/**
 * Log a debug message with optional data
 */
export function logDebug(message: string, ...data: any[]) {
  if (VERBOSE_LOGGING) {
    console.log(`[DEBUG] ${message}`, ...data);
  }
}

/**
 * Log an error with stack trace and additional context
 */
export function logError(message: string, error: any, context?: any) {
  console.error(`[ERROR] ${message}`);

  if (error instanceof Error) {
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
  } else {
    console.error("Error object:", error);
  }

  if (context) {
    console.error("Context:", context);
  }
}

/**
 * Wrap a function with debug logging
 */
export function withLogging<T extends (...args: any[]) => Promise<any>>(
  name: string,
  fn: T,
): T {
  return (async (...args: any[]) => {
    try {
      logDebug(`${name} called with:`, args);
      const result = await fn(...args);
      logDebug(`${name} succeeded:`, result);
      return result;
    } catch (error) {
      logError(`${name} failed`, error, { args });
      throw error;
    }
  }) as T;
}

/**
 * Log details about a Convex ID
 */
export function logId(name: string, id: any) {
  console.log(`[ID INFO] ${name}:`, {
    value: id,
    type: typeof id,
    constructor: id?.constructor?.name,
    toString: id?.toString?.(),
    json: JSON.stringify(id),
  });
}

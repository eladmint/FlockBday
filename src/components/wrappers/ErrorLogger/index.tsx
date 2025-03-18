import React, { useEffect } from "react";

interface ErrorLoggerProps {
  children: React.ReactNode;
  componentName: string;
}

/**
 * A component that logs errors and provides detailed debugging information
 * Wrap critical components with this to get better error information
 */
export function ErrorLogger({ children, componentName }: ErrorLoggerProps) {
  useEffect(() => {
    console.log(`${componentName} mounted`);
    return () => {
      console.log(`${componentName} unmounted`);
    };
  }, [componentName]);

  return (
    <React.Fragment>
      {/* Add an error boundary here if needed */}
      {children}
    </React.Fragment>
  );
}

/**
 * Logs detailed information about an operation
 */
export function logOperation(operation: string, data: any) {
  console.group(`Operation: ${operation}`);
  console.log("Data:", data);
  console.log("Timestamp:", new Date().toISOString());
  console.groupEnd();
}

/**
 * Logs detailed information about an error
 */
export function logError(operation: string, error: any, context?: any) {
  console.group(`Error in ${operation}`);
  console.error("Error object:", error);
  if (error instanceof Error) {
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
  }
  if (context) {
    console.error("Context:", context);
  }
  console.error("Timestamp:", new Date().toISOString());
  console.groupEnd();
}

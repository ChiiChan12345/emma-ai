/**
 * Production monitoring and error tracking
 */

interface ErrorReport {
  message: string;
  stack?: string;
  url: string;
  userId?: string;
  timestamp: Date;
  userAgent: string;
}

export function reportError(error: Error, context?: Record<string, any>) {
  if (typeof window === 'undefined') return; // Server-side
  
  const errorReport: ErrorReport = {
    message: error.message,
    stack: error.stack,
    url: window.location.href,
    timestamp: new Date(),
    userAgent: navigator.userAgent,
    ...context,
  };
  
  // In production, you might want to send this to a service like:
  // - AWS CloudWatch
  // - Sentry
  // - LogRocket
  // - DataDog
  
  console.error('Production Error:', errorReport);
  
  // Example: Send to CloudWatch or external service
  if (process.env.NODE_ENV === 'production') {
    // fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorReport),
    // }).catch(() => {
    //   // Silently fail if error reporting fails
    // });
  }
}

export function setupErrorBoundary() {
  if (typeof window === 'undefined') return;
  
  window.addEventListener('error', (event) => {
    reportError(new Error(event.message), {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    reportError(new Error(event.reason), {
      type: 'unhandledPromiseRejection',
    });
  });
} 
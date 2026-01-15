/**
 * Simple logging abstraction for the application
 *
 * - Respects environment (verbose in dev, minimal in prod)
 * - Easy to extend with external logging services (Sentry, LogRocket, etc.)
 * - Consistent log format across the application
 */

const isDev = process.env.NODE_ENV === 'development';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

function formatMessage(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` ${JSON.stringify(context)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
}

export const logger = {
  /**
   * Debug logs - only shown in development
   */
  debug: (message: string, context?: LogContext) => {
    if (isDev) {
      console.log(formatMessage('debug', message, context));
    }
  },

  /**
   * Info logs - only shown in development
   */
  info: (message: string, context?: LogContext) => {
    if (isDev) {
      console.info(formatMessage('info', message, context));
    }
  },

  /**
   * Warning logs - shown in all environments
   */
  warn: (message: string, context?: LogContext) => {
    console.warn(formatMessage('warn', message, context));
  },

  /**
   * Error logs - shown in all environments
   * Consider integrating with error tracking service (Sentry, etc.)
   */
  error: (message: string, error?: Error | unknown, context?: LogContext) => {
    const errorContext = error instanceof Error
      ? { ...context, errorName: error.name, errorMessage: error.message }
      : { ...context, error };

    console.error(formatMessage('error', message, errorContext));

    // TODO: Integrate with error tracking service
    // Example with Sentry:
    // if (typeof window !== 'undefined' && !isDev) {
    //   Sentry.captureException(error, { extra: context });
    // }
  },
};

export default logger;

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

export enum ErrorType {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMIT = 'RATE_LIMIT',
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE',
  DATABASE = 'DATABASE',
  NETWORK = 'NETWORK',
  UNKNOWN = 'UNKNOWN',
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: Error;
  userId?: string;
  requestId?: string;
  component?: string;
}

export interface ErrorMetadata {
  type: ErrorType;
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  requestId?: string;
  userId?: string;
  component?: string;
  stackTrace?: string;
  recoverable: boolean;
}

export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: Record<string, any>;
  public readonly recoverable: boolean;
  public readonly timestamp: string;

  constructor(
    type: ErrorType,
    code: string,
    message: string,
    statusCode: number = 500,
    details?: Record<string, any>,
    recoverable: boolean = true
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.recoverable = recoverable;
    this.timestamp = new Date().toISOString();

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  toJSON(): ErrorMetadata {
    return {
      type: this.type,
      code: this.code,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp,
      stackTrace: this.stack,
      recoverable: this.recoverable,
    };
  }
}

export class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;
  private currentLevel: LogLevel = LogLevel.INFO;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setLevel(level: LogLevel): void {
    this.currentLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.currentLevel;
  }

  private addLog(entry: LogEntry): void {
    if (this.logs.length >= this.maxLogs) {
      this.logs.shift(); // Remove oldest log
    }
    this.logs.push(entry);

    // In production, you'd send this to external logging service
    console.log(`[${LogLevel[entry.level]}] ${entry.message}`, entry.context);
  }

  debug(message: string, context?: Record<string, any>, component?: string): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    
    this.addLog({
      timestamp: new Date().toISOString(),
      level: LogLevel.DEBUG,
      message,
      context,
      component,
    });
  }

  info(message: string, context?: Record<string, any>, component?: string): void {
    if (!this.shouldLog(LogLevel.INFO)) return;
    
    this.addLog({
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      message,
      context,
      component,
    });
  }

  warn(message: string, context?: Record<string, any>, component?: string): void {
    if (!this.shouldLog(LogLevel.WARN)) return;
    
    this.addLog({
      timestamp: new Date().toISOString(),
      level: LogLevel.WARN,
      message,
      context,
      component,
    });
  }

  error(message: string, error?: Error, context?: Record<string, any>, component?: string): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;
    
    this.addLog({
      timestamp: new Date().toISOString(),
      level: LogLevel.ERROR,
      message,
      error,
      context,
      component,
    });
  }

  fatal(message: string, error?: Error, context?: Record<string, any>, component?: string): void {
    this.addLog({
      timestamp: new Date().toISOString(),
      level: LogLevel.FATAL,
      message,
      error,
      context,
      component,
    });
  }

  getLogs(level?: LogLevel, component?: string, limit: number = 100): LogEntry[] {
    let filteredLogs = this.logs;

    if (level !== undefined) {
      filteredLogs = filteredLogs.filter(log => log.level >= level);
    }

    if (component) {
      filteredLogs = filteredLogs.filter(log => log.component === component);
    }

    return filteredLogs.slice(-limit);
  }

  clearLogs(): void {
    this.logs = [];
  }
}

export class ErrorHandler {
  private static logger = Logger.getInstance();

  static createValidationError(message: string, details?: Record<string, any>): AppError {
    return new AppError(
      ErrorType.VALIDATION,
      'VALIDATION_FAILED',
      message,
      400,
      details,
      true
    );
  }

  static createAuthenticationError(message: string = 'Authentication failed'): AppError {
    return new AppError(
      ErrorType.AUTHENTICATION,
      'AUTH_FAILED',
      message,
      401,
      undefined,
      false
    );
  }

  static createAuthorizationError(message: string = 'Insufficient permissions'): AppError {
    return new AppError(
      ErrorType.AUTHORIZATION,
      'INSUFFICIENT_PERMISSIONS',
      message,
      403,
      undefined,
      false
    );
  }

  static createNotFoundError(resource: string, id?: string): AppError {
    const message = id ? `${resource} with ID ${id} not found` : `${resource} not found`;
    return new AppError(
      ErrorType.NOT_FOUND,
      'RESOURCE_NOT_FOUND',
      message,
      404,
      { resource, id },
      true
    );
  }

  static createConflictError(message: string, details?: Record<string, any>): AppError {
    return new AppError(
      ErrorType.CONFLICT,
      'RESOURCE_CONFLICT',
      message,
      409,
      details,
      true
    );
  }

  static createRateLimitError(limit: number, windowMs: number): AppError {
    return new AppError(
      ErrorType.RATE_LIMIT,
      'RATE_LIMIT_EXCEEDED',
      `Rate limit exceeded: ${limit} requests per ${windowMs}ms`,
      429,
      { limit, windowMs },
      true
    );
  }

  static createExternalServiceError(service: string, originalError?: Error): AppError {
    return new AppError(
      ErrorType.EXTERNAL_SERVICE,
      'EXTERNAL_SERVICE_ERROR',
      `External service error: ${service}`,
      502,
      { service, originalError: originalError?.message },
      true
    );
  }

  static createDatabaseError(operation: string, originalError?: Error): AppError {
    return new AppError(
      ErrorType.DATABASE,
      'DATABASE_ERROR',
      `Database operation failed: ${operation}`,
      500,
      { operation, originalError: originalError?.message },
      true
    );
  }

  static handleError(error: unknown, component?: string): AppError {
    if (error instanceof AppError) {
      this.logger.error(
        `AppError in ${component}: ${error.message}`,
        error,
        { type: error.type, code: error.code },
        component
      );
      return error;
    }

    if (error instanceof Error) {
      this.logger.error(
        `Unexpected error in ${component}: ${error.message}`,
        error,
        undefined,
        component
      );
      
      return new AppError(
        ErrorType.UNKNOWN,
        'UNEXPECTED_ERROR',
        'An unexpected error occurred',
        500,
        { originalMessage: error.message },
        false
      );
    }

    this.logger.error(
      `Unknown error type in ${component}`,
      undefined,
      { error },
      component
    );

    return new AppError(
      ErrorType.UNKNOWN,
      'UNKNOWN_ERROR',
      'An unknown error occurred',
      500,
      { error },
      false
    );
  }

  static async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000,
    component?: string
  ): Promise<T> {
    let lastError: Error = new Error('No attempts made');

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        this.logger.debug(
          `Attempting operation (${attempt}/${maxRetries})`,
          undefined,
          component
        );
        
        const result = await operation();
        
        if (attempt > 1) {
          this.logger.info(
            `Operation succeeded on attempt ${attempt}`,
            undefined,
            component
          );
        }
        
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        this.logger.warn(
          `Operation failed on attempt ${attempt}: ${lastError.message}`,
          undefined,
          component
        );

        if (attempt < maxRetries) {
          const delay = delayMs * Math.pow(2, attempt - 1); // Exponential backoff
          this.logger.debug(
            `Retrying in ${delay}ms`,
            { delay, attempt, maxRetries },
            component
          );
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    this.logger.error(
      `Operation failed after ${maxRetries} attempts`,
      lastError,
      { maxRetries },
      component
    );

    throw this.handleError(lastError, component);
  }

  static async withTimeout<T>(
    operation: () => Promise<T>,
    timeoutMs: number,
    component?: string
  ): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new AppError(
          ErrorType.NETWORK,
          'OPERATION_TIMEOUT',
          `Operation timed out after ${timeoutMs}ms`,
          408,
          { timeoutMs },
          true
        ));
      }, timeoutMs);
    });

    try {
      return await Promise.race([operation(), timeoutPromise]);
    } catch (error) {
      this.logger.error(
        `Operation timed out or failed`,
        error instanceof Error ? error : undefined,
        { timeoutMs },
        component
      );
      throw this.handleError(error, component);
    }
  }

  static createCircuitBreaker(
    maxFailures: number = 5,
    resetTimeoutMs: number = 60000
  ) {
    let failures = 0;
    let lastFailTime = 0;
    let state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

    return async <T>(operation: () => Promise<T>, component?: string): Promise<T> => {
      const now = Date.now();

      // Check if we should reset the circuit breaker
      if (state === 'OPEN' && now - lastFailTime >= resetTimeoutMs) {
        state = 'HALF_OPEN';
        this.logger.info('Circuit breaker transitioning to HALF_OPEN', undefined, component);
      }

      // If circuit is open, fail fast
      if (state === 'OPEN') {
        throw new AppError(
          ErrorType.EXTERNAL_SERVICE,
          'CIRCUIT_BREAKER_OPEN',
          'Circuit breaker is open - service unavailable',
          503,
          { failures, lastFailTime },
          true
        );
      }

      try {
        const result = await operation();
        
        // Success - reset circuit breaker
        if (state === 'HALF_OPEN') {
          state = 'CLOSED';
          failures = 0;
          this.logger.info('Circuit breaker reset to CLOSED', undefined, component);
        }
        
        return result;
      } catch (error) {
        failures++;
        lastFailTime = now;

        if (failures >= maxFailures) {
          state = 'OPEN';
          this.logger.error(
            `Circuit breaker opened after ${failures} failures`,
            error instanceof Error ? error : undefined,
            { maxFailures, resetTimeoutMs },
            component
          );
        }

        throw this.handleError(error, component);
      }
    };
  }
}

// Global error handlers for unhandled errors
if (typeof window !== 'undefined') {
  // Browser environment
  window.addEventListener('error', (event) => {
    Logger.getInstance().fatal(
      'Unhandled error',
      event.error,
      { filename: event.filename, lineno: event.lineno, colno: event.colno },
      'GLOBAL'
    );
  });

  window.addEventListener('unhandledrejection', (event) => {
    Logger.getInstance().fatal(
      'Unhandled promise rejection',
      event.reason instanceof Error ? event.reason : undefined,
      { reason: event.reason },
      'GLOBAL'
    );
  });
} else {
  // Node.js environment
  process.on('uncaughtException', (error) => {
    Logger.getInstance().fatal('Uncaught exception', error, undefined, 'GLOBAL');
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    Logger.getInstance().fatal(
      'Unhandled promise rejection',
      reason instanceof Error ? reason : undefined,
      { reason, promise },
      'GLOBAL'
    );
  });
}

export const logger = Logger.getInstance();
export default ErrorHandler; 
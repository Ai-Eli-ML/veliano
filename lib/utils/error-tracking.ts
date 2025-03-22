import * as Sentry from '@sentry/nextjs';

export type ErrorSeverity = 'fatal' | 'error' | 'warning' | 'info';

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  additionalData?: Record<string, unknown>;
}

export interface ErrorMetadata {
  severity: ErrorSeverity;
  context: ErrorContext;
}

export interface PerformanceOptions {
  description?: string;
  component?: string;
  action?: string;
  userId?: string;
  data?: Record<string, unknown>;
}

// Define our own transaction interface to avoid direct dependency on Sentry types
export interface ITransaction {
  finish(): void;
  setTag(name: string, value: string): void;
}

class ErrorTracker {
  private static configureScope(scope: Sentry.Scope, metadata: ErrorMetadata): void {
    scope.setLevel(metadata.severity);
    
    if (metadata.context.component) {
      scope.setTag('component', metadata.context.component);
    }
    
    if (metadata.context.action) {
      scope.setTag('action', metadata.context.action);
    }
    
    if (metadata.context.userId) {
      scope.setUser({ id: metadata.context.userId });
    }
    
    if (metadata.context.additionalData) {
      scope.setExtras(metadata.context.additionalData);
    }
  }

  static captureError = (error: Error, metadata: ErrorMetadata): string => {
    let eventId = '';
    Sentry.withScope((scope) => {
      ErrorTracker.configureScope(scope, metadata);
      eventId = Sentry.captureException(error);
    });
    return eventId;
  };

  static captureMessage = (message: string, metadata: ErrorMetadata): string => {
    let eventId = '';
    Sentry.withScope((scope) => {
      ErrorTracker.configureScope(scope, metadata);
      eventId = Sentry.captureMessage(message);
    });
    return eventId;
  };

  static setUser = (userId: string | null): void => {
    if (userId) {
      Sentry.setUser({ id: userId });
    } else {
      Sentry.setUser(null);
    }
  };

  static startTransaction = (name: string, options?: PerformanceOptions): ITransaction | undefined => {
    try {
      // Use any to work around the TypeScript issues
      const transaction = (Sentry as any).startTransaction({
        name,
        description: options?.description,
        data: options?.data,
        tags: {
          component: options?.component,
          action: options?.action
        }
      });

      if (options?.userId && transaction) {
        transaction.setTag('user_id', options.userId);
      }

      return transaction;
    } catch (error) {
      // Silently fail if Sentry isn't initialized
      console.error('Failed to start Sentry transaction:', error);
      return undefined;
    }
  };

  static finishTransaction = (transaction: ITransaction | undefined): void => {
    if (transaction) {
      transaction.finish();
    }
  };

  static measurePerformance = <T>(
    name: string, 
    operation: () => Promise<T>, 
    options?: PerformanceOptions
  ): Promise<T> => {
    const transaction = ErrorTracker.startTransaction(name, options);
    
    return operation()
      .then(result => {
        ErrorTracker.finishTransaction(transaction);
        return result;
      })
      .catch(error => {
        ErrorTracker.finishTransaction(transaction);
        ErrorTracker.captureError(error, {
          severity: 'error',
          context: {
            component: options?.component,
            action: options?.action,
            userId: options?.userId,
            additionalData: options?.data
          }
        });
        throw error;
      });
  };
}

export const trackError = ErrorTracker.captureError;
export const trackMessage = ErrorTracker.captureMessage;
export const setErrorUser = ErrorTracker.setUser;
export const startPerformanceTransaction = ErrorTracker.startTransaction;
export const finishPerformanceTransaction = ErrorTracker.finishTransaction;
export const measurePerformance = ErrorTracker.measurePerformance; 
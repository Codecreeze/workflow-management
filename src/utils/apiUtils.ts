import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

/**
 * Type predicate to narrow an unknown error to `FetchBaseQueryError`
 */
export function isFetchBaseQueryError(
  error: unknown
): error is FetchBaseQueryError {
  return typeof error === 'object' && error != null && 'status' in error;
}

/**
 * Type predicate to narrow an unknown error to an object with a string 'message' property
 */
export function isErrorWithMessage(
  error: unknown
): error is { message: string } {
  return (
    typeof error === 'object' &&
    error != null &&
    'message' in error &&
    typeof (error as any).message === 'string'
  );
}

/**
 * Extract error message from RTK Query error
 */
export function getErrorMessage(error: unknown): string {
  if (isFetchBaseQueryError(error)) {
    const errMsg = 'error' in error ? error.error : JSON.stringify(error.data);
    return errMsg;
  } else if (isErrorWithMessage(error)) {
    return error.message;
  }
  return 'An unknown error occurred';
}

/**
 * Transform error object to a human-readable message
 */
export function handleApiError(error: FetchBaseQueryError | SerializedError | undefined): string {
  if (!error) return 'An unknown error occurred';
  
  if ('status' in error) {
    // FetchBaseQueryError
    const errStatus = error.status;
    if (errStatus === 'FETCH_ERROR') return 'Network error. Please check your connection.';
    if (errStatus === 'PARSING_ERROR') return 'Failed to parse response.';
    if (errStatus === 'TIMEOUT_ERROR') return 'Request timed out.';
    if (errStatus === 'CUSTOM_ERROR') return error.error || 'An unknown error occurred';
    
    // HTTP status code
    if (typeof errStatus === 'number') {
      if (errStatus === 401) return 'Unauthorized. Please log in again.';
      if (errStatus === 403) return 'Access forbidden.';
      if (errStatus === 404) return 'Resource not found.';
      if (errStatus === 500) return 'Server error. Please try again later.';
      return `Request failed with status code ${errStatus}`;
    }
  }
  
  // SerializedError
  if ('message' in error && error.message) return error.message;
  
  return 'An unknown error occurred';
} 
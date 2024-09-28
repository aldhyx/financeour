import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DEFAULt_ERROR_MESSAGE =
  'Something went wrong. Please try again or contact support if the issue continues.';

export const getErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) return error.message;

  return DEFAULt_ERROR_MESSAGE;
};

export const log = (message?: any, ...optionalParams: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(message, ...optionalParams);
  }
};

import { type ClassValue, clsx } from 'clsx';
import type { LucideIcon } from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import { twMerge } from 'tailwind-merge';

export function removeDuplicateArray<T>(arr: T[]): T[] {
  const s = new Set(arr);
  return [...s];
}

export function iconWithClassName(icon: LucideIcon) {
  cssInterop(icon, {
    className: {
      target: 'style',
      nativeStyleToProp: {
        color: true,
        opacity: true,
      },
    },
  });
}

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

export const constructSearchParams = (
  params: Record<string, string | number | undefined | null>
) => {
  const queryString = Object.keys(params)
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(params[key] || '')}`
    )
    .join('&');

  return `?${queryString}`;
};

/* eslint-disable drizzle/enforce-delete-with-where */

import { useMMKVDevTools } from '@dev-plugins/react-native-mmkv/build/useMMKVDevTools';
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export const MMKVDevTool = () => {
  useMMKVDevTools({ storage });
  return null;
};

export function getItem<T>(key: string): T | null {
  const value = storage.getString(key);
  return value ? JSON.parse(value) || null : null;
}

export async function setItem<T>(key: string, value: T) {
  storage.set(key, JSON.stringify(value));
}

export async function removeItem(key: string) {
  storage.delete(key);
}

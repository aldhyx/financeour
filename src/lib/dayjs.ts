import 'dayjs/locale/id';
import 'dayjs/locale/en';

import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';

export default function initializeDayJs() {
  dayjs.extend(isToday);
  // TODO: find how to adjust local by user device
  dayjs.locale('id'); // use locale globally
}

/**
 * @param template see available format here: https://day.js.org/docs/en/display/format
 */
export function dateToString(date: Date, template?: string): string {
  return dayjs(date).format(template ?? 'dddd, D MMMM YYYY');
}

export function stringToDate(date: string): Date {
  return dayjs(date).toDate();
}

export function dateIsSunday(date: Date): boolean {
  return dayjs(date).day() === 0;
}

export const getToday = () => dayjs().toDate();
export const getYesterday = (date?: Date) =>
  dayjs(date).subtract(1, 'day').toDate();
export const getTomorrow = (date?: Date) => dayjs(date).add(1, 'day').toDate();

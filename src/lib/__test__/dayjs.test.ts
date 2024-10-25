import dayjs from 'dayjs';

import {
  dateIsSunday,
  getToday,
  getTomorrow,
  getYesterday,
} from '@/lib/dayjs/utils';

describe('dateIsSunday', () => {
  it('should return true if the date is a Sunday', () => {
    const sunday = new Date('2024-09-22'); // 22nd September 2024 is a Sunday
    expect(dateIsSunday(sunday)).toBe(true);
  });

  it('should return false if the date is not a Sunday', () => {
    const friday = new Date('2024-09-20'); // 20th September 2024 is a Friday
    expect(dateIsSunday(friday)).toBe(false);
  });
});

describe('getToday', () => {
  it("should return today's date", () => {
    const today = getToday();
    const expectedToday = dayjs().toDate();
    expect(today.toDateString()).toBe(expectedToday.toDateString());
  });
});

describe('getYesterday', () => {
  it("should return yesterday's date", () => {
    const today = new Date('2024-09-20');
    const yesterday = getYesterday(today);
    const expectedYesterday = dayjs(today).subtract(1, 'day').toDate();
    expect(yesterday.toDateString()).toBe(expectedYesterday.toDateString());
  });

  it("should return yesterday's date from the current day if no date is provided", () => {
    const today = getToday();
    const yesterday = getYesterday();
    const expectedYesterday = dayjs(today).subtract(1, 'day').toDate();
    expect(yesterday.toDateString()).toBe(expectedYesterday.toDateString());
  });
});

describe('getTomorrow', () => {
  it("should return tomorrow's date", () => {
    const today = new Date('2024-09-20');
    const tomorrow = getTomorrow(today);
    const expectedTomorrow = dayjs(today).add(1, 'day').toDate();
    expect(tomorrow.toDateString()).toBe(expectedTomorrow.toDateString());
  });

  it("should return tomorrow's date from the current day if no date is provided", () => {
    const today = getToday();
    const tomorrow = getTomorrow();
    const expectedTomorrow = dayjs(today).add(1, 'day').toDate();
    expect(tomorrow.toDateString()).toBe(expectedTomorrow.toDateString());
  });
});

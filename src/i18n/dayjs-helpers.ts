import dayjs from 'dayjs';

const dateIsSunday = (date: Date): boolean => {
  return dayjs(date).day() === 0;
};
const getToday = () => dayjs().toDate();
const getYesterday = (date?: Date) => dayjs(date).subtract(1, 'day').toDate();
const getTomorrow = (date?: Date) => dayjs(date).add(1, 'day').toDate();

export { dateIsSunday, getToday, getTomorrow, getYesterday };

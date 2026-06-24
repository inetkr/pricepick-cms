import moment from 'moment';

// Date and Time Utilities
export const formatBirthday = (data: string): string => {
  if (!data || data.length !== 8) return data;
  return `${data.slice(0, 4)}/${data.slice(4, 6)}/${data.slice(6, 8)}`;
};

export const formatDate = (data: string | number | Date): string =>
  moment(new Date(data)).format('YYYY/MM/DD');

export const formatDateTimeFull = (data: string | number | Date): string => {
  if (!data || data === '' || data === '-') return '-';
  return moment(new Date(data)).format('YYYY/MM/DD HH:mm:ss')
};

export const formatDateCompact = (data: string | number | Date): string =>
  moment(new Date(data)).format('YYYYMMDD');

export const formatDateTimeWithMinutes = (data: string | number | Date): string =>
  data ? moment(new Date(data)).format('YYYY/MM/DD HH:mm') : '-';

  export const formatDateFromCompactDateTime = (data: string): string => {
    if (!data || data.length !== 14) return data;
    const m = moment(data, 'YYYYMMDDHHmmss');
    return m.isValid() ? m.format('YYYY/MM/DD HH:mm:ss') : data;
  };

export const formatDateTime = (data: string | number | Date): string =>
  data ? moment(new Date(data)).format('YYYY/MM/DD HH:mm:ss') : '-';

export const convertKoreanDateTime = (input: string): string => {
  if (!input) return '-';
  const m = moment(input, ['YYYY/MM/DD HH:mm:ss', 'YYYY/MM/DD HH:mm', 'YYYY/MM/DD']);
  if (!m.isValid()) return input;
  const hour = m.hour();
  const period = hour < 12 ? '오전' : '오후';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${m.format('YYYY.MM.DD')} ${period} ${hour12}:${m.format('mm')}`;
};

export const secondsToHMS = (value: number | string): string => {
  const sec = Number(value);
  if (!sec) return '00:00:00';
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = sec % 60;
  return [hours, minutes, seconds].map(v => v.toString().padStart(2, '0')).join(':');
};

export const getSignInTime = (timeWeb?: number, timeApp?: number): string => {
  if (!timeWeb && timeApp) return formatDateTime(timeApp);
  if (timeWeb && !timeApp) return formatDateTime(timeWeb);
  if (timeWeb && timeApp) return formatDateTime(Math.max(timeWeb, timeApp));
  return '-';
};

export const ageToMilliseconds = (age: number): number | null =>
  age === -1 ? null : moment().subtract(age, 'years').valueOf();

export const getAgeFromBirthday = (birthday: string): number | null => {
  const birthDate = moment(birthday, 'YYYY/MM/DD');
  return birthDate.isValid() ? moment().diff(birthDate, 'years') : null;
};

export const getAgeFromTimestamp = (timestamp: number | null): number => {
  if (timestamp === null) return 0;
  return moment().diff(moment(timestamp), 'years');
};

export const ageToBirthday = (age: number): string | null =>
  age === -1 ? null : moment().subtract(age, 'years').format('YYYY/MM/DD');

// URL Utilities
export const ensureHttps = (url: string): string =>
  /^https?:\/\//i.test(url) ? url : `https://${url}`;

// i18n Utilities
export const translateMessage = (t: (msg: string) => string, message: string): string =>
  t(message?.toLowerCase());

export const translateNavigation = (t: (msg: string) => string, message: string): string =>
  t(message?.toLowerCase());

// Balance Utilities
export const getWithdrawableBalance = (balance: number): number => {
  const MIN_WITHDRAWABLE = 20000;
  const UNIT = 10000;
  return balance < MIN_WITHDRAWABLE ? 0 : Math.floor(balance / UNIT) * UNIT;
};

export const formatDateFromYYYYMMDDToDots = (data?: string | number | Date | null): string => {
  if (!data) return '';
  if (typeof data === 'string' && /^\d{8}$/.test(data)) {
    return data.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1.$2.$3');
  }
  return formatDate(data as string | number | Date);
};

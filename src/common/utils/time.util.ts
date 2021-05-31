import moment from 'moment';
import 'moment-timezone';
export const toTimezoneDate = (
  time: string,
  timezone: string,
  format: string
) => {
  return moment(time).tz(timezone).format(format);
};

export const toTimeFormat = (time: string, format: string) => {
  return moment(time).format(format);
};

export const toTimeFormatFromTimestamp = (
  time: string,
  format: string,
  zone: {
    posfix: string;
    value: number;
  }
) => {
  return time
    ? `${moment
        .unix(+time)
        .utc()
        .add(zone.value, 'h')
        .format(format)} ${zone.posfix}`
    : '';
};

export const toDayFormatFromTimestamp = (time: string) => {
  const expireDate = moment.unix(+time);
  const today = moment();
  const diffInDays = expireDate.diff(today, 'days');
  return diffInDays;
};

export const toCustomZoneTime = (
  time: string,
  format: string,
  zone: {
    posfix: string;
    value: number;
  }
) =>
  time
    ? `${moment(time).utc().add(zone.value, 'h').format(format)} ${zone.posfix}`
    : '';

export const getDaysNext = (day: number, format: string) => {
  return moment().add(day, 'days').startOf('day').format(format);
};

export const getCurrentDate = (
  locale: string,
  format: string,
  zone: {
    posfix: string;
    value: number;
  }
) => {
  return moment().locale(locale).utc().add(zone.value, 'h').format(format);
};

export const getCurrentTime = (
  locale: string,
  format: string,
  zone: {
    posfix: string;
    value: number;
  }
) => {
  return moment().locale(locale).utc().add(zone.value, 'h').format(format);
};

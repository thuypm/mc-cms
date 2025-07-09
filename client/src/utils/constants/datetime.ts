import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

export const DATE_TIME_FORMAT = {
  FULL_SECOND: 'YYYY/MM/DD HH:mm:ss',
  FULL: 'YYYY/MM/DD HH:mm',
  DATE: 'yy/mm/dd',
  DAY_ONLY: 'DD/MM/YYYY',
  HOUR: 'HH:mm',
}
export const FORMAT_TIME = 'HH:mm:ss'
export const TIME_ZONE = 'Asia/Tokyo'

dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)

export const convertJPToLocalTime = (timeString) => {
  return dayjs(timeString).tz(dayjs.tz.guess())
}

export function getOffsetBetweenTimezonesForDate(date, timezone1, timezone2) {
  const timezone1Date = convertDateToAnotherTimeZone(date, timezone1)
  const timezone2Date = convertDateToAnotherTimeZone(date, timezone2)
  return timezone1Date.getTime() - timezone2Date.getTime()
}

function convertDateToAnotherTimeZone(date, timezone) {
  const dateString = date.toLocaleString('en-US', {
    timeZone: timezone,
  })
  return new Date(dateString)
}
export const differenceTimezoneOffset = getOffsetBetweenTimezonesForDate(
  new Date(),
  dayjs.tz.guess(),
  TIME_ZONE
)

export function createMonthArray(startMonth: number): Date[] {
  const currentDate = new Date()
  const startYear = currentDate.getFullYear() - 1 // Năm trước đó
  const months = []

  for (let i = startMonth; i <= 12; i++) {
    const date = new Date(startYear, i, 1)
    // const monthName = date.toLocaleString('default', { month: 'long' })
    months.push(date)
  }

  for (let i = 1; i < startMonth; i++) {
    const date = new Date(startYear + 1, i, 1)
    // const monthName = date.toLocaleString('default', { month: 'long' })
    months.push(date)
  }

  return months
}

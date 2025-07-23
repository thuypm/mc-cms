import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

export const convertTime = (timeParams) => {
  const dateTime = new Date(timeParams).toLocaleDateString('en-GB')
  return dateTime
}

export const getHour = (time) => {
  const date = new Date(time)
  return `${date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`}:${
    date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`
  }`
}
export function removeEmptyPropertyObject<T>(obj: T) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v)) as T
}

export const getAvatarName = (name?: string) => {
  return name?.split(' ').slice(-1).join(' ').charAt(0)
}
export const skipNullParams = (data: any) => {
  let editData = {}
  if (data)
    Object.keys(data).forEach((key) => {
      if (data[key]) {
        editData[key] = data[key]
      }
    })
  return editData
}

export const skipEmptyObject = (data: any) => {
  let editData = {}
  Object.keys(data).forEach((key) => {
    if (data[key]) {
      editData[key] = data[key]
    }
  })
  return Object.keys(editData).length > 0 ? editData : null
}

const emailRegex = new RegExp(
  /^[A-Za-z0-9_!#$%&'*+\\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/,
  'gm'
)

export function formatNumber(x: any) {
  if (x !== null && x !== undefined) return Number(x).toLocaleString('vi-Vi')
  else return null
}

export const isEmail = (email: string) => {
  return emailRegex.test(email)
}
export const deepClone = (data: any) => {
  try {
    return JSON.parse(JSON.stringify(data))
  } catch (error) {
    return {}
  }
}

export const parseJSON = (data: string) => {
  try {
    return JSON.parse(data)
  } catch (error) {
    return null
  }
}
dayjs.extend(utc)

export const getCurrentWeekRange = (): [Date, Date] => {
  const today = dayjs().utc()

  const startOfWeek =
    today.day() === 0
      ? today.subtract(6, 'day')
      : today.startOf('week').add(1, 'day') // Monday

  const startUTC = startOfWeek.startOf('day').toDate()
  const endUTC = startOfWeek.add(6, 'day').startOf('day').toDate()

  return [startUTC, endUTC]
}

import i18n from 'i18n'

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

export const formatPhone = (phone: string) => {
  if (!phone) return ''
  const firstPhone = phone.slice(0, 3)
  const middlePhone = phone.slice(3, phone.length - 4)
  const endPhone = phone.slice(3, phone.length).slice(-4)

  return `${firstPhone}-${middlePhone ? `${middlePhone}-` : ''}${endPhone}`
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
export const copyRichtTextHtml = (
  element: HTMLElement,
  cb?: Function,
  fb?: Function
) => {
  try {
    var doc = document,
      text = element,
      range,
      selection

    if (window.getSelection) {
      selection = window.getSelection()
      range = doc.createRange()
      range.selectNodeContents(text)
      selection.removeAllRanges()
      selection.addRange(range)
    }
    document.execCommand('copy')
    window.getSelection().removeAllRanges()
    cb && cb()
  } catch (error) {
    fb && fb()
  }
}
export const copyToClipBoard = (
  text: string,
  callback?: Function,
  fallback?: Function
) => {
  if (navigator && navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        if (callback) {
          callback()
          return
        }
      })
      .catch((err) => {
        console.log(err)
        fallback && fallback(err)
      })
  }
}

export const checkNullDeleteItem = (
  populateItem: any,
  stringKey?: string,
  itemName?: string
) => {
  if (populateItem === -1) return i18n.t('Item is deleted', { item: itemName })
  if (!populateItem) return ''

  const keys = stringKey.split('.')

  let item = populateItem

  keys.forEach((key) => {
    item = item ? item[key] : null
  })

  return item
}

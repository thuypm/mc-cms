import sanitizeHtml from 'sanitize-html'

export const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const getPhoneNumberInput = (value: string) => {
  return value.slice(0, 15).replace(/[^0-9.]/g, '')
}
export const countCharactersEditor = (content: string): number => {
  if (!content || content.length === 0) return 0
  let normalizedText = content
    .replace(/(\r\n|\n|\r)/gm, ' ')
    .replace(/^\s+|\s+$/g, '')
    .replace('&nbsp;', ' ')
    .replace(/\s\s+/g, ' ')

  const contentWithoutHtml = sanitizeHtml(normalizedText, {
    allowedTags: ['img'],
    allowedAttributes: {
      img: ['src', 'align'],
    },
  })

  return contentWithoutHtml.trim().length
}

export const contentWithoutHtml = (content: string): string => {
  if (!content || content.length === 0) return ''
  let normalizedText = content
    .replace(/(\r\n|\n|\r)/gm, ' ')
    .replace(/^\s+|\s+$/g, '')
    .replace('&nbsp;', ' ')
    .replace(/\s\s+/g, ' ')

  const contentWithoutHtml = sanitizeHtml(normalizedText, {
    allowedTags: [],
  })

  return contentWithoutHtml.trim()
}
export const furiganaRegex = /^([ァ-ンヴ]|ー)+$/

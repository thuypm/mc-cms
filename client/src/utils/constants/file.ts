interface FileView {
  size: number
  _id: string
  file?: File
  status: any
  url?: string
  uri?: string
  s3Key?: string
  mimeType?: string
  screenshots?: Array<any>
  caption?: string
}
export const VALID_IMAGE_EXT = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/heic',
  'image/heif',
  'image/gif',
]
export const RESIZE_IMAGE_SUPPORT = /\.(jpg|jpeg|png)$/i
export const LIST_ACCPET_IMAGE_TYPE = ['jpeg', 'png', 'jpg', 'gif']
export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024
export const MAX_COUNT_UPLOAD = 5
export const LIST_ACCEPT_VIDEO_TYPE = [
  'mp4',
  'quicktime',
  'avi',
  'wmv',
  'mkv',
  'vob',
  'mpg',
  'hevc',
  'wma',
  'mpeg1',
  'mpeg2',
  'mpegps',
  'mkv',
  'mov',
  'flv',
  'wmv9',
  '3gp',
  '3gpp',
  'mpeg',
  'webm',
  'mpeg4',
]
export const VALID_VIDEO_EXT = [
  'video/mp4',
  'video/quicktime',
  'video/avi',
  'video/wmv',
  'video/mkv',
  'video/vob',
  'video/mpg',
  'video/hevc',
  'video/wma',
  'video/mpeg1',
  'video/mpeg2',
  'video/mpegps',
  'video/mkv',
  'video/mov',
  'video/flv',
  'video/wmv9',
  'video/3gp',
  'video/3gpp',
  'video/mpeg',
  'video/webm',
  'video/mpeg4',
]

export const VALID_AUDIO_VIDEO_EXT = [
  ...VALID_VIDEO_EXT,
  'audio/wav',
  'audio/wave',
]

export const VALID_AUDIO_VIDEO_MINE_TYPE = ['wav']

export const VALID_IMAGE_RESIZE = ['png', 'jpeg', 'jpg']

export const getFileSize = (size: number) => size / 1024 / 1024

export const convertMBToByte = (size: number) => size * 1024 * 1024
export const getTargetListFile = (
  listFle: FileView[],
  includeType: string[]
): FileView[] => {
  return listFle.filter((f) => includeType.includes(f.mimeType))
}
export const isImage = (file: FileView) => {
  return VALID_IMAGE_EXT.includes(file?.mimeType)
}

export const getExtension = (file?: string) =>
  file ? file.split('.').pop() : null

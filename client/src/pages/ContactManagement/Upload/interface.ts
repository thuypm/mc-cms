import { FileUploadStatus } from './enum'

export interface FileView {
  size: number
  _id: string
  file?: File
  status: FileUploadStatus
  url?: string
  uri?: string
  s3Key?: string
  mimeType?: string
  screenshots?: Array<any>
  caption?: string
}

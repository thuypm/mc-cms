import { BaseDataList, BaseItem } from 'Base'

declare module 'Models' {
  interface FormUpload {
    title: string
    description: string
    avatarType: 'default' | 'upload'
    topic: string
    project: string
    avatar: any
    hashtags: []
    publishedType: 'now' | 'schedule'
    date: string
    time: any
    video: any
  }

  export interface ImageResponse {
    height?: number
    mimeType?: string
    name?: string
    s3Key?: string
    size?: number
    uri?: string
    url?: string
    width?: number
  }

  export interface IMode {
    isConvert?: boolean
    s3Key?: string
    uri?: string
    urlVod?: string
  }

  interface Topic extends BaseItem {}
  export interface ListTopic extends BaseDataList<Topic> {}
  export interface ListProject extends BaseDataList<ProjectItem> {}

  export interface IUploadSuccessInfo {
    slug: string
    _id: string
    shortId: number | null
  }

  export interface IInfoBeforeUpload {
    duration?: number
    isCovert?: boolean
    mimeType?: string
    mode?: {
      '360p'?: IMode
      '480p'?: IMode
      '720p'?: IMode
      '1080p'?: IMode
    }
    name?: string
    s3Key?: string
    screenshots?: ImageResponse[]
    size?: number
    uri?: string
    url?: string
    urlVod?: string
  }
  export interface UploadModels {
    formUpload: FormUpload
    projects: ListProject
    // topics: ListTopic
    topics: any
    progressUpload: number
    statusUpload: string
    searchingProject: boolean
    searchingTopic: boolean
    loading: boolean
    uploadSuccessInfo: IUploadSuccessInfo
    infoBeforeUpload: IInfoBeforeUpload
    infoVideoBeforeUpload: UploadFile
    infoThumbnail: ImageResponse
    dataPostVideo: any
  }
}

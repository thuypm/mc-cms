declare module 'Base' {
  export interface BaseItem {
    _id: string
    name: string
  }
  export interface BaseItemResponse {
    _id: string
  }
  export interface BaseDataList<T extends BaseItem> {
    meta: {
      page?: number
      limit?: number
      totalPages?: number
      total?: number
    }
    data?: Array<T>

    relations?: any
    [key?: string]: any
  }
  export interface BaseDataListResponse<T extends BaseItemResponse> {
    meta: {
      page?: number
      limit?: number
      totalPages?: number
      total?: number
    }
    items?: Array<T>
    relations?: any
  }

  export interface BaseItemResponseTranslate extends BaseItemResponse {
    translation: Array<BaseTranslateResponse>
  }
  export interface BaseTranslateResponse {
    languageCode: string
    name: string
  }

  export interface LabeledValue {
    label: string
    value: string
    [key: string]: any
  }
  export interface UserActionBy {
    data: { _id: string; fullname: string }
    source: string
  }
  export interface UserMeeyId {
    _id: string
    meeyId: string
    meeyIdData: {
      username?: string
      phone?: string
      email?: string
      facebookId?: string
      appleId?: string
      googleId?: string
      isTrial?: boolean
      name: string
      sex?: string
      dob?: boolean
      avatar: string
      address?: string
      phoneCode?: string
      affilate?: string
      status?: number
      emailVerified?: boolean
      phoneVerified?: boolean
      linkedAccountToken?: string
      chat?: string
      identityCard?: string
      objectType?: string
      company?: string
      website?: string
      introduce?: string
      accountType?: string
      anonymous?: number
      _id?: string
      createdDate?: string
      id?: string
      isLinkedWallet?: boolean
    }
  }

  export interface SWRResponse<T> {
    data?: T
    error?: any
    mutate?: any
    isValidating?: boolean
  }

  export interface IBaseCreateData {
    createdBy: {
      data: CreateByItem
      source: string
    }
    updatedBy: {
      data: CreateByItem
      source: string
    }
    createdAt: string
    updatedAt: string
  }
}

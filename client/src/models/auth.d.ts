declare module 'Models' {
  export interface AuthModels {
    authToken: string
  }

  export interface UserFromMeeyId {
    username: string
    phone: string
    email: string
    facebookId: string
    appleId: string
    googleId: string
    isTrial: boolean
    name: string
    sex: string
    dob: string
    avatar: string
    address: string
    phoneCode: string
    affilate: string
    status: number
    emailVerified: boolean
    phoneVerified: boolean
    linkedAccountToken: string
    chat: {
      userId: string
      authToken: string
    }
    identityCard: string
    objectType: string
    company: string
    website: string
    introduce: string
    accountType: string
    anonymous: boolean
    refCode: string
    _id: string
    createdDate: string
    _id: string
    isLinkedWallet: boolean
  }

  export interface UserActionBy {
    data: {
      _id: string
      fullName: string
    }
    username: string
    phone: string
    email: string
    name: string
    avatar: string
    _id: string
  }
  export interface UserMeeyId {
    _id: string
    meeyId?: string
    roleCode?: string
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
}

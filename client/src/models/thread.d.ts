declare module 'Models' {
  export interface Thread {
    _id: string
    title: string
    createdById: string
    lastUpdaterId: string
    branchIds: string[]
    readBy: string[]
    createdAt: '2024-07-02T15:23:42.774Z'
    updatedAt: '2024-07-02T15:23:42.774Z'
    __v: 0
    branches?: Branch[]

    lastUpdater: UserSyncData[]
    createdBy: UserSyncData
    fromBranch?: Branch
    isRead: boolean
  }

  export interface MessageData {
    _id: string
    content: string
    isFirstMessage: boolean
    createdById: string
    threadId: string
    attachments: string[]
    createdAt: string
    updatedAt: string
    __v: 0
    sendFrom?: Branch
    createdBy: UserSyncData
    id: string
  }
}

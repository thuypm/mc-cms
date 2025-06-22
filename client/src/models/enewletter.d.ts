declare module 'Models' {
  export interface EnewLetter {
    title: 'string'
    content: 'string'
    scheduledTime: '2024-06-30T08:33:49.060Z'
    status: EnewLetterStatusEnum
    sendTo: string
    sendAllInBranch: boolean
    sendingEventIds: string[]
    sendingBranchIds: string[]
    sendingBranches?: Branch[]
    sendingEvents?: EventData[]
    sendAllEvents?: boolean
    createdBy?: UserSyncData
    sendAllCustomers?: boolean
    _id: '667fc7397aefdbf0ed9f6609'
    createdAt: '2024-06-29T08:35:05.570Z'
    updatedAt: '2024-06-29T08:35:05.570Z'
    __v: 0
    id: '667fc7397aefdbf0ed9f6609'
  }
}

import { BranchStatusEnum } from 'utils/constants/branch'
import { CustomerStatusEnum } from 'utils/constants/customer'
import { EventStatusEnum } from 'utils/constants/event'
import { UserRoleEnum, UserStatusEnum } from 'utils/constants/user'

declare module 'Models' {
  export interface UserSyncData {
    _id: string
    email: string
    fullName: string
    gender: string
    status: UserStatusEnum
    phoneNumber: string
    role: UserRoleEnum
    createdBy: any
    createdAt: string
    note?: string
    address?: any
    branch?: Branch
  }
  export interface HeadquarterInfoData extends UserSyncData {
    branchInformation: {
      data: {
        _id: '6784bf11749ebee710dfea0f'
        name: 'Test 13/01'
        totalEvent: 19
        totalCustomer: 42
      }[]
      meta: {
        perPage: 10
        page: 1
        totalPages: 1
        total: 10
      }
    }

    branch: {
      count: 32
      status: BranchStatusEnum
    }[]

    event: {
      overall: {
        count: 16
        status: EventStatusEnum
        year?: number
      }[]
      byMonth: {
        year?: number
        eventCount: 16
        month: number
      }[]
    }
    customer: {
      overall: {
        count: 16
        year?: number

        status: CustomerStatusEnum
      }[]
      byMonth: {
        customerCount: 16
        month: number
        year?: number
      }[]
    }
  }
}

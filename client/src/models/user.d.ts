import { BranchStatusEnum } from 'utils/constants/branch'
import { CustomerStatusEnum } from 'utils/constants/customer'
import { EventStatusEnum } from 'utils/constants/event'
import { USER_POSITION } from 'utils/constants/user'

declare module 'Models' {
  export interface UserSyncData {
    _id: string // ObjectId dạng string
    name: string
    positionText: string
    class: string
    branch: string
    phone: string
    email: string
    subject: string
    roles: string[] // hoặc cụ thể: ('SUPER_ADMIN' | 'TEACHER')[]
    position: USER_POSITION
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
        limit: 10
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

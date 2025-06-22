import { CustomerStatusEnum } from 'utils/constants/customer'
import { RegistrationStatusEnum } from 'utils/constants/event'

declare module 'Models' {
  export interface EventData {
    _id: string
    title: string
    description: string
    location: string
    startTimeEvent: string
    endTime: string
    receptionBefore: string
    cancelBefore: string
    applicationUnit: string
    maxRegistrationsEvent: number
    countdownAfter: number
    registeredQuantityEvent?: number
    status?: string
    note?: string
    remindBefore?: number
    timeslots: {
      startTime: string
      endTime: string
      maxRegistrations: number
      registeredQuantity: number
      _id: string
    }[]
    sendMailInviteTimes?: number
    questions: [
      {
        question: string
        answer: string
        order: number
      },
    ]
  }

  export interface RegistrationEventData {
    _id: string
    name: string
    furigana: string
    email: string
    phoneNumber: string
    createdAt: string
    guest: number
    status: RegistrationStatusEnum
    note: string
    aboutThisCustomer?: Array<string>
    history: string[]
    timeslots: {
      startTime: string
      endTime: string
      maxRegistrations: number
      registeredQuantity: number
      _id: string
    }
    []
    timeslot: any
    event: EventData
    customer: {
      _id: string
      email: string
      note?: string
      status?: CustomerStatusEnum
      registeredHistory: { registeredNumber: 1; canceledNumber: 0 }
    }
  }
  export interface RegistrationHistoryData {
    _id: string

    email: string
    name: string
    furigana: string
    phoneNumber: string
    guest: 1
    status: string
    eventId: string
    createdAt: string
    updatedAt: string
    __v: 0
    event: EventData[]
  }
}

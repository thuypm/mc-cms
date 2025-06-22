declare module 'Models' {
  export interface CustomerData {
    _id: string
    email: string
    name: string
    furigana: string
    phoneNumber: string
    registeredBy: string
    status: string
    note: string
    registeredHistory: {
      registeredNumber: 1
      canceledNumber: number
    }
  }
}

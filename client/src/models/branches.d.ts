declare module 'Models' {
  export interface BranchUser {
    name: string
    _id: string
  }
  export interface Branch {
    _id: string
    email?: string
    role?: string
    name: string
    phoneNumber?: string
    address?: string
    personInCharged?: string
    status?: string
    note?: string
  }
  export interface EmailTemplateDetail {
    _id: string
    type: string
    title: string
    content: string
    exampleTemplate?: string
  }
}

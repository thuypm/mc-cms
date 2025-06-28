import { UserSyncData } from 'Models'
import i18n from 'i18n'

export enum USER_POSITION {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum UserRoleEnum {
  Headquarter = 'Headquarter Admin',
  BranchAdmin = 'Branch Admin',
}
export const USER_ROLE_LABEL = {
  [UserRoleEnum.Headquarter]: i18n.t('Headquarter'),
  [UserRoleEnum.BranchAdmin]: i18n.t('Branch'),
}
export const USER_ROLES = [
  {
    label: USER_ROLE_LABEL[UserRoleEnum.Headquarter],
    value: UserRoleEnum.Headquarter,
  },
  {
    label: USER_ROLE_LABEL[UserRoleEnum.BranchAdmin],
    value: UserRoleEnum.BranchAdmin,
  },
]

export enum UserStatusEnum {
  Active = 'Active',
  Pending = 'Pending',
  Inactive = 'Inactive',
  Blocked = 'Block',
}
export const USER_STATUS_LABEL = {
  [UserStatusEnum.Active]: i18n.t(UserStatusEnum.Active),
  [UserStatusEnum.Pending]: i18n.t(UserStatusEnum.Pending),
  [UserStatusEnum.Inactive]: i18n.t(UserStatusEnum.Inactive),
  [UserStatusEnum.Blocked]: i18n.t(UserStatusEnum.Blocked),
}
export const USER_STATUSES = [
  {
    label: USER_STATUS_LABEL[UserStatusEnum.Active],
    value: UserStatusEnum.Active,
  },
  {
    label: USER_STATUS_LABEL[UserStatusEnum.Pending],
    value: UserStatusEnum.Pending,
  },
  {
    label: USER_STATUS_LABEL[UserStatusEnum.Inactive],
    value: UserStatusEnum.Inactive,
  },
  {
    label: USER_STATUS_LABEL[UserStatusEnum.Blocked],
    value: UserStatusEnum.Blocked,
  },
]
export const isHeaquarter = (user: UserSyncData) => {
  return user.position === UserRoleEnum.Headquarter
}
const matches = window.location.pathname.split('/')
export const branchRouterId = matches?.[1]

import i18n from 'i18n'
import { Tag } from 'primereact/tag'
import { BRANCH_STATUS_LABEL, BranchStatusEnum } from 'utils/constants/branch'
import { CustomerStatusEnum } from 'utils/constants/customer'
import { EnewLetterStatusEnum } from 'utils/constants/enewletter'
import {
  EVENT_STATUS_LABEL,
  EventStatusEnum,
  RegistrationStatusEnum,
} from 'utils/constants/event'
import { USER_STATUS_LABEL, UserStatusEnum } from 'utils/constants/user'

export const getBranchStatusTag = (status: any) => {
  switch (status) {
    case BranchStatusEnum.Active:
      return (
        <Tag severity="success" className="uppercase">
          {i18n.t(BRANCH_STATUS_LABEL[status])}
        </Tag>
      )
    case BranchStatusEnum.Inactive:
      return (
        <Tag severity="danger" className="uppercase">
          {i18n.t(BRANCH_STATUS_LABEL[status])}
        </Tag>
      )
  }
}

export const getUserStatusTag = (status: any) => {
  switch (status) {
    case UserStatusEnum.Active:
      return (
        <Tag severity="success" className="uppercase">
          {i18n.t(USER_STATUS_LABEL[status])}
        </Tag>
      )
    case UserStatusEnum.Pending:
      return (
        <Tag severity="warning" className="uppercase">
          {i18n.t(USER_STATUS_LABEL[status])}
        </Tag>
      )
    case UserStatusEnum.Blocked:
      return (
        <Tag severity="danger" className="uppercase">
          {i18n.t(USER_STATUS_LABEL[status])}
        </Tag>
      )
    case UserStatusEnum.Inactive:
      return (
        <Tag className="p-tag-inactive uppercase">
          {i18n.t(USER_STATUS_LABEL[status])}
        </Tag>
      )
  }
}

export const getEventStatusTag = (status: any) => {
  switch (status) {
    case EventStatusEnum.Open:
      return (
        <Tag severity="success" className="uppercase">
          {i18n.t(EVENT_STATUS_LABEL[status])}
        </Tag>
      )
    case EventStatusEnum.UpComming:
      return (
        <Tag severity="warning" className="uppercase">
          {i18n.t(EVENT_STATUS_LABEL[status])}
        </Tag>
      )
    case EventStatusEnum.OnGoing:
      return (
        <Tag severity="danger" className="uppercase">
          {i18n.t(EVENT_STATUS_LABEL[status])}
        </Tag>
      )
    case EventStatusEnum.Canceled:
      return (
        <Tag className="p-tag-inactive uppercase">
          {i18n.t(EVENT_STATUS_LABEL[status])}
        </Tag>
      )
    case EventStatusEnum.Finished:
      return (
        <Tag severity="info" className="uppercase">
          {i18n.t(EVENT_STATUS_LABEL[status])}
        </Tag>
      )
  }
}

export const getRegistrationStatusTag = (status: any) => {
  switch (status) {
    case RegistrationStatusEnum.Registed:
      return (
        <Tag severity="success" className="uppercase">
          {i18n.t(status)}
        </Tag>
      )
    case RegistrationStatusEnum.Canceled:
      return (
        <Tag severity="warning" className="p-tag-inactive">
          {i18n.t(status)}
        </Tag>
      )
    case RegistrationStatusEnum.Invalid:
      return (
        <Tag severity="danger" className="p-tag-purpil">
          {i18n.t(status)}
        </Tag>
      )
  }
}
export const getCustomerStatusTag = (status: any) => {
  switch (status) {
    case CustomerStatusEnum.Active:
      return (
        <Tag severity="success" className="uppercase">
          {i18n.t(CustomerStatusEnum.Active)}
        </Tag>
      )

    case CustomerStatusEnum.Blocked:
      return (
        <Tag severity="danger" className="uppercase">
          {i18n.t(CustomerStatusEnum.Blocked)}
        </Tag>
      )
  }
}

export const getEnewLetterStatusTag = (status: any) => {
  switch (status) {
    case EnewLetterStatusEnum.Scheduled:
      return (
        <Tag severity="success" className="uppercase">
          {i18n.t(EnewLetterStatusEnum.Scheduled)}
        </Tag>
      )

    case EnewLetterStatusEnum.Delevered:
      return (
        <Tag className="uppercase" severity="warning">
          {i18n.t(EnewLetterStatusEnum.Delevered)}
        </Tag>
      )
  }
}

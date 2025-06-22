'use client'

import i18n from 'i18n'

export enum EventStatusEnum {
  Open = 'Open for registration',
  UpComming = 'Up coming',
  OnGoing = 'On going',
  Finished = 'Finished',
  Canceled = 'Canceled',
}

export const EVENT_STATUS_LABEL = {
  [EventStatusEnum.Open]: i18n.t(EventStatusEnum.Open),
  [EventStatusEnum.UpComming]: i18n.t(EventStatusEnum.UpComming),
  [EventStatusEnum.OnGoing]: i18n.t(EventStatusEnum.OnGoing),
  [EventStatusEnum.Finished]: i18n.t(EventStatusEnum.Finished),
  [EventStatusEnum.Canceled]: i18n.t(EventStatusEnum.Canceled),
}
export const EVENT_STATUSES = [
  {
    label: EVENT_STATUS_LABEL[EventStatusEnum.Open],
    value: EventStatusEnum.Open,
  },
  {
    label: EVENT_STATUS_LABEL[EventStatusEnum.UpComming],
    value: EventStatusEnum.UpComming,
  },
  {
    label: EVENT_STATUS_LABEL[EventStatusEnum.OnGoing],
    value: EventStatusEnum.OnGoing,
  },
  {
    label: EVENT_STATUS_LABEL[EventStatusEnum.Finished],
    value: EventStatusEnum.Finished,
  },
  {
    label: EVENT_STATUS_LABEL[EventStatusEnum.Canceled],
    value: EventStatusEnum.Canceled,
  },
]

export enum EventApplicationUnitEnum {
  Single = 'Single',
  Multiple = 'Multiple',
}
export const EVENT_APPLICATION_UNITS = [
  {
    label: EventApplicationUnitEnum.Single,
    value: EventApplicationUnitEnum.Single,
  },
  {
    label: EventApplicationUnitEnum.Multiple,
    value: EventApplicationUnitEnum.Multiple,
  },
]

export enum RegistrationStatusEnum {
  Registed = 'REGISTERED',
  Canceled = 'CANCELED',
  Invalid = 'INVALID MAIL',
}
export const REGISTRAtION_STATUSES = [
  {
    label: RegistrationStatusEnum.Registed,
    value: RegistrationStatusEnum.Registed,
  },
  {
    label: RegistrationStatusEnum.Canceled,
    value: RegistrationStatusEnum.Canceled,
  },
  {
    label: RegistrationStatusEnum.Invalid,
    value: RegistrationStatusEnum.Invalid,
  },
]

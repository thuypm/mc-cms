import clsx from 'clsx'
import DateTimePicker from 'components/DateTimePicker'
import FormField from 'components/FormField'
import dayjs from 'dayjs'
import { observer } from 'mobx-react'
import { Dropdown } from 'primereact/dropdown'
import InputNumberCustom from 'components/InputNumberCustom'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { DATE_TIME_FORMAT } from 'utils/constants/datetime'
import { EventApplicationUnitEnum } from 'utils/constants/event'
import { useParams } from 'react-router'

const EventInfo = ({ disabled }: { disabled?: boolean }) => {
  const { t } = useTranslation()

  const { control, getValues } = useFormContext()
  const { id } = useParams()
  const disabledAll = !!id

  return (
    <>
      <FormField
        control={control}
        name="receptionBefore"
        className="w-6 pr-2"
        rules={{
          required: t('required', {
            field: t('Registration Before time'),
          }),
          validate: (val) => {
            const startTime = getValues().startTimeEvent
            const firstSlot = getValues().timeslots?.[0]?.timeRange?.from
            if (val?.getTime() <= new Date().getTime())
              return t('Reception must greater than current')

            if (startTime && firstSlot) {
              if (
                val?.getTime() >
                dayjs(
                  `${dayjs(startTime).format(DATE_TIME_FORMAT.DAY_ONLY)} ${firstSlot}`,
                  DATE_TIME_FORMAT.FULL_SECOND
                ).valueOf()
              )
                return t(
                  'Registration Before time must be less than or equal to the event start time'
                )
            }

            return null
          },
        }}
        render={({ field, fieldState }) => {
          return (
            <DateTimePicker
              minDate={new Date()}
              {...field}
              tabIndex={100}
              disabled={disabled}
              placeholder={t('Select')}
              className={clsx('w-full', {
                'p-invalid': fieldState.invalid,
              })}
            />
          )
        }}
        label={t('Registration Before')}
      />

      <FormField
        control={control}
        className="w-6 pr-2"
        name="cancelBefore"
        rules={{
          required: t('required', {
            field: t('Cancel Before'),
          }),
          validate: (val) => {
            const startTime = getValues().startTimeEvent
            const receptionTime = getValues().receptionBefore

            const firstSlot = getValues().timeslots?.[0]?.timeRange?.from
            if (startTime && firstSlot) {
              if (
                val.getTime() >
                dayjs(
                  `${dayjs(startTime).format(DATE_TIME_FORMAT.DAY_ONLY)} ${firstSlot}`,
                  DATE_TIME_FORMAT.FULL_SECOND
                ).valueOf()
              )
                return t(
                  'Cancel before time must be less than or equal to the event start time'
                )
              if (val.getTime() < receptionTime?.getTime())
                return t(
                  'Cancel before time must be greater than or equal to Registration Before time'
                )
            }
            return null
          },
        }}
        render={({ field, fieldState }) => {
          return (
            <DateTimePicker
              {...field}
              disabled={disabled}
              minDate={new Date()}
              tabIndex={101}
              placeholder={t('Select')}
              className={clsx('', {
                'p-invalid': fieldState.invalid,
              })}
            />
          )
        }}
        label={t('Cancel Before')}
      />
      <FormField
        control={control}
        rules={{
          required: t('required', {
            field: t('Remind Before'),
          }),
          validate: (val) => {
            const startTime = getValues().startTimeEvent
            const firstSlot = getValues().timeslots?.[0]?.timeRange?.from

            if (val < 0) return t('Remind Before must be >= 0')

            if (startTime && firstSlot) {
              if (
                dayjs(
                  `${dayjs(startTime).format(DATE_TIME_FORMAT.DAY_ONLY)} ${firstSlot}`,
                  DATE_TIME_FORMAT.FULL_SECOND
                ).valueOf() -
                  val * 3600000 <
                  new Date().getTime() &&
                !disabledAll
              )
                return t('The remind time must be after the current time.')
            }
            return null
          },
        }}
        name="remindBefore"
        className="w-6 pr-2"
        render={({ field, fieldState }) => {
          return (
            <div className="relative">
              <InputNumberCustom
                {...field}
                onChange={({ value }) => {
                  field.onChange(value)
                }}
                disabled={disabledAll}
                maxLength={6}
                placeholder={t('Select')}
                className={clsx('', {
                  'p-invalid': fieldState.invalid,
                })}
              />

              <span
                className="absolute text-gray-400"
                style={{
                  right: 8,
                  top: 12,
                }}
              >
                {t('hours')}
              </span>
            </div>
          )
        }}
        label={t('Remind Before')}
      />

      <FormField
        control={control}
        name="applicationUnit"
        rules={{
          required: t('required', { field: t('Applications Unit') }),
        }}
        className="w-6 pr-2"
        render={({ field, fieldState }) => {
          return (
            <Dropdown
              disabled={disabledAll}
              {...field}
              placeholder={t('Select')}
              options={Object.values(EventApplicationUnitEnum).map((key) => ({
                label: t(key),
                value: key,
              }))}
              className={clsx({
                'p-invalid': fieldState.invalid,
              })}
            />
          )
        }}
        label={t('Applications Unit')}
      />
    </>
  )
}
export default observer(EventInfo)

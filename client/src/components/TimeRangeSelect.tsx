import clsx from 'clsx'
import dayjs from 'dayjs'
import e from 'express'
import { InputText } from 'primereact/inputtext'
import { OverlayPanel } from 'primereact/overlaypanel'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DATE_TIME_FORMAT, FORMAT_TIME } from 'utils/constants/datetime'

interface TimeRangeValue {
  from: string
  to: string
}
interface TimeRangeSelectProps {
  value?: TimeRangeValue
  onChange?: (value: TimeRangeValue) => void
  className?: string
  disabled?: boolean
}
const numberTo2CharactorString = (value: number): string => {
  return value !== null ? (value < 10 ? '0' + value : value.toString()) : ''
}
const NumberRegex = /\d+/g
export const TimeSelect = ({
  value,
  onChange,
  className,
  onPressEnter,
}: {
  value?: string
  className?: string
  onPressEnter?: (data) => void
  onChange?: (v?: any) => void
}) => {
  const currentHour = useMemo(() => {
    return value ? dayjs(value, FORMAT_TIME).hour() : 0
  }, [value])
  const currentMinute = useMemo(() => {
    return value ? dayjs(value, FORMAT_TIME).minute() : 0
  }, [value])

  const onChangeValue = (hour: number, minute: number) => {
    if (hour > 23 || hour < 0) hour = 0
    if (minute > 59 || minute < 0) minute = 0

    onChange(
      `${numberTo2CharactorString(hour)}:${numberTo2CharactorString(minute)}:00`
    )
    // onChange && onChange(new Date(rootTime + hour * 3600000 + minute * 60000))
  }

  return (
    <div
      className={clsx(
        'flex gap-2 align-items-center justify-content-center',
        className
      )}
    >
      <div className="flex-column flex items-center gap-2">
        <button
          tabIndex={1}
          className="text-grey-06 justify-content-center cursor-pointer flex bg-transparent outline-none border-none 
           w-full duration-300"
          onClick={() => onChangeValue(currentHour + 1, currentMinute)}
        >
          <i className="isax-arrow-up"></i>
        </button>
        <InputText
          keyfilter={'int'}
          value={numberTo2CharactorString(currentHour)}
          className="w-3rem"
          placeholder="00"
          onKeyUp={(e) => {
            if (e.key === 'Enter') onPressEnter(value)
          }}
          // value={`${currentHour}`}
          onChange={(e) => {
            const number = Number(e.target.value.match(NumberRegex))
            onChangeValue(number, currentMinute)
          }}
        />
        <button
          tabIndex={1}
          className="text-grey-06 justify-content-center cursor-pointer flex bg-transparent outline-none border-none 
           w-full duration-300"
          onClick={() => onChangeValue(currentHour - 1, currentMinute)}
        >
          <i className="isax-arrow-bottom "></i>
        </button>
      </div>

      <div>:</div>
      <div className="flex-column flex items-center gap-2">
        <button
          tabIndex={1}
          className="text-grey-06 justify-content-center cursor-pointer flex bg-transparent outline-none border-none 
           w-full duration-300"
          onClick={() => onChangeValue(currentHour, currentMinute + 1)}
        >
          <i className="isax-arrow-up"></i>
        </button>
        <InputText
          keyfilter={'int'}
          className="w-3rem"
          placeholder="00"
          value={numberTo2CharactorString(currentMinute)}
          onKeyUp={(e) => {
            if (e.key === 'Enter') onPressEnter(value)
          }}
          onChange={(e) => {
            const number = Number(e.target.value.match(NumberRegex))
            onChangeValue(currentHour, number)
          }}
        />
        <button
          tabIndex={1}
          className="text-grey-06 justify-content-center cursor-pointer flex bg-transparent outline-none border-none 
           w-full duration-300"
          onClick={() => onChangeValue(currentHour, currentMinute - 1)}
        >
          <i className="isax-arrow-bottom"></i>
        </button>
      </div>
    </div>
  )
}
function TimeRangeSelect(props: TimeRangeSelectProps) {
  const { className, value, disabled, onChange } = props
  const op = useRef(null)

  const [timeValue, setTimeValue] = useState<TimeRangeValue>({
    from: null,
    to: null,
  })

  useEffect(() => {
    if (value) setTimeValue(value)
  }, [value])

  const onChangeValue = (val) => {
    if (onChange) onChange(val)
    else setTimeValue(val)
  }
  const { t } = useTranslation()
  return (
    <div className={clsx('time-range-select', className)}>
      <div
        className={clsx(
          'time-range-input cursor-pointer',
          {
            'time-range-input-disabled': disabled,
          },
          timeValue.from && timeValue.to ? '' : 'text-gray-600 opacity-70'
        )}
        onClick={disabled ? null : (e) => op.current.toggle(e)}
      >
        {timeValue.from && timeValue.to
          ? `${dayjs(timeValue.from, FORMAT_TIME).format(DATE_TIME_FORMAT.HOUR)} - ${dayjs(timeValue.to, FORMAT_TIME).format(DATE_TIME_FORMAT.HOUR)}`
          : t('Time range')}
      </div>
      <OverlayPanel ref={op} className="">
        <div className="flex   align-items-center gap-4">
          <TimeSelect
            value={timeValue.from}
            onPressEnter={(v) => {
              op.current.hide()
            }}
            onChange={(v) => {
              onChangeValue({
                from: v,
                to: timeValue.to ?? '00:00:00',
              })
            }}
          />
          <div className="w-4rem border-solid"></div>
          <TimeSelect
            value={timeValue.to}
            onPressEnter={(v) => {
              op.current.hide()
            }}
            onChange={(v) => {
              onChangeValue({
                from: timeValue.from ?? '00:00:00',
                to: v,
              })
            }}
          />
        </div>
      </OverlayPanel>
    </div>
  )
}

export default TimeRangeSelect

import clsx from 'clsx'
import dayjs from 'dayjs'
import { Calendar } from 'primereact/calendar'
import { OverlayPanel } from 'primereact/overlaypanel'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { DATE_TIME_FORMAT, FORMAT_TIME } from 'utils/constants/datetime'
import { TimeSelect } from './TimeRangeSelect'

const DEFAULT_TIME_STRING = '00:00:00'
interface DateTimePickerProps {
  onChange?: (e: Date) => void
  value?: Date
  placeholder?: string
  className?: string
  showTime?: boolean
  minDate?: Date
  disabled?: boolean
  tabIndex?: number
}
const DateTimePicker = forwardRef((props: DateTimePickerProps, ref: any) => {
  const {
    value,
    onChange,
    placeholder,
    showTime = true,
    className,
    disabled,
    tabIndex,
    ...restProps
  } = props
  const op = useRef(null)

  const [currentValue, setCurrentValue] = useState<dayjs.Dayjs>(null)
  const handleChange = (value: dayjs.Dayjs) => {
    if (onChange) onChange(value.toDate())
    else setCurrentValue(value)
  }
  useEffect(() => {
    setCurrentValue(value ? dayjs(value) : null)
  }, [value])
  const [focus, setFocus] = useState(false)
  return (
    <>
      <div
        className={clsx(
          'date-time-select',
          {
            'date-time-select-placeholder': !currentValue,
            'date-time-select-focus': focus,
            'date-time-select-disabled': disabled,
          },
          className
        )}
        ref={ref}
        tabIndex={tabIndex}
        onClick={disabled ? null : (e) => op.current.toggle(e)}
      >
        {currentValue
          ? currentValue.format(
              showTime ? DATE_TIME_FORMAT.FULL : DATE_TIME_FORMAT.DAY_ONLY
            )
          : placeholder}
        <div className="date-time-select-icon">
          <i className="isax-calendar-2 isax text-white"> </i>
        </div>
      </div>
      {/* <IconField
        className={clsx(focus ? 'p-input-focus' : '', className)}
        onClick={(e) => op.current.toggle(e)}
      >
        <InputIcon className="pi  pi-calendar"> </InputIcon>
        <InputText
          ref={ref}
          placeholder={placeholder ?? t('Select')}
          readOnly
          onFocus={(e) => {
            setFocus(true)
            // e.target.blur()
          }}
          onBlur={() => setFocus(false)}
          value={
            currentValue
              ? currentValue.format(
                  showTime ? DATE_TIME_FORMAT.FULL : DATE_TIME_FORMAT.DAY_ONLY
                )
              : ''
          }
        />
      </IconField> */}

      <OverlayPanel
        ref={op}
        onShow={() => {
          setFocus(true)
        }}
        onHide={() => {
          setFocus(false)
        }}
      >
        <Calendar
          panelClassName="border-0"
          value={value}
          inline
          locale={'jp'}
          onChange={(e) => {
            handleChange(
              dayjs(
                `${dayjs(e.target.value).format(DATE_TIME_FORMAT.DAY_ONLY)} ${currentValue ? currentValue.format(FORMAT_TIME) : DEFAULT_TIME_STRING}`,
                DATE_TIME_FORMAT.FULL
              )
            )
          }}
          {...restProps}
        />
        {showTime ? (
          <TimeSelect
            className="mt-2"
            value={
              currentValue
                ? currentValue?.format(FORMAT_TIME)
                : DEFAULT_TIME_STRING
            }
            onChange={(val) => {
              handleChange(
                dayjs(
                  `${currentValue ? currentValue.format(DATE_TIME_FORMAT.DAY_ONLY) : dayjs(new Date()).format(DATE_TIME_FORMAT.DAY_ONLY)} ${val}`,
                  DATE_TIME_FORMAT.FULL
                )
              )
            }}
          />
        ) : null}
      </OverlayPanel>
    </>
  )
})
export default DateTimePicker

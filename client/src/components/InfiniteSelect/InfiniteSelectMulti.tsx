import clsx from 'clsx'
import LoadingDot from 'components/LoadingDot'
import { InputText } from 'primereact/inputtext'
import {
  ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import ClickOutside from 'utils/click-outside'
import { TIMEOUT_SEARCH } from 'utils/constants/commons-constant'
import { ObjectId } from 'utils/helper/object'
import { useAnimateState } from './useAnimateState'
import { useDataInfinite } from './useDataInfinite'

interface ISelectProps {
  value?: any
  payload?: any
  onChange?: (value) => void
  onSelect?: (value) => void
  opened?: boolean
  className?: string
  dropdownClass?: string
  placeholder?: string
  children?: React.ReactNode
  header?: React.ReactNode
  title?: React.ReactNode
  optionSelected?: any[]
  onVisibleChange?: (vis: boolean) => void
  wrapperClassName?: string
  onReset?: () => void
  labelField?: string
  valueField?: string
  disabled?: boolean
  method?: string
  error?: any
  path?: string
  baseUrl?: string
  customResponseItem?: (value) => any
  customRenderItem?: (item, active) => ReactNode
  customLabelPlaceHolder?: (value) => any
  headers?: any
}
const OptionItem = (props: any) => {
  const { label, value, onSelect, active, item, customRenderItem } = props
  return (
    <div
      className={clsx(
        'p-3    hover:bg-gray-100 transition-duration-300 cursor-pointer border-t border-t-grey-200 text-fs-14 flex justify-between  items-center',
        active ? 'bg-primary-100 text-primary-500 ' : ''
      )}
      onClick={() => {
        onSelect({ label, value })
      }}
    >
      {customRenderItem ? (
        customRenderItem(item, active)
      ) : (
        <>
          <p className={clsx('m-0 text-fs-14 line-clamp-1')}>{label}</p>
          {
            <div className={clsx('meey-radio', active ? 'active' : '')}></div>
          }{' '}
        </>
      )}
    </div>
  )
}
const InfiniteSelectMulti = forwardRef(
  (
    {
      opened,
      className,
      method,
      customResponseItem,
      dropdownClass,
      placeholder,
      payload = { limit: 10 },
      wrapperClassName,
      labelField = 'name',
      valueField = '_id',
      onVisibleChange,
      headers,
      disabled,
      path,
      baseUrl,
      onChange,
      customRenderItem,
      error,
      value,
      customLabelPlaceHolder,
      onSelect,
    }: ISelectProps,
    ref: any
  ) => {
    const [loading, setLoading] = useState(true)
    const { trigger, triggerClose, isOpen, triggerOpen } = useAnimateState({
      open: opened,
      handleClose: () => {
        onVisibleChange && onVisibleChange(false)
      },
    })
    const [focus, setFocus] = useState(false)

    const [selectedItem, setSelectedItem] = useState(null)

    const [valueInput, setValueInput] = useState('')

    const { data, setSize, size, isValidating } = useDataInfinite(
      {
        ...payload,
        keyword: valueInput,
      },

      {
        method,
        path,
        baseUrl,
        isActive: isOpen,
        customResponseItem,
        headers,
      }
    )
    const hasMore = !!(data && data[data.length - 1]?.length === payload?.limit)

    const optionSorted = useMemo(() => {
      const options = [].concat(...(data || []))

      return selectedItem
        ? [
            selectedItem,
            ...options.filter(
              (e) => e?.[valueField] !== selectedItem[valueField]
            ),
          ]
        : options
    }, [data, selectedItem, valueField])

    useEffect(() => {
      if (!isValidating || data) setLoading(false)
    }, [data, isValidating])

    const onLoadMore = () => {
      setSize(size + 1)
    }

    const randomId = useRef(ObjectId())

    useEffect(() => {
      setSelectedItem(value)
    }, [value])

    const onSelectItem = ({ value }) => {
      const selectedItem = optionSorted.find((e) => e[valueField] === value)
      inputRef.current.value = ''
      setValueInput('')
      onSelect && onSelect(selectedItem)
      onChange ? onChange(selectedItem) : setSelectedItem(selectedItem)
      triggerClose()
    }
    const timeoutSearchRef = useRef(null)
    const inputRef = useRef(null)
    useImperativeHandle(ref, () => inputRef.current, [])
    return (
      <ClickOutside
        active={isOpen}
        onClick={() => {
          if (isOpen) {
            triggerClose()
          }
        }}
      >
        <div className={clsx('relative dropdown', wrapperClassName)}>
          <InputText
            onFocus={() => {
              setFocus(true)
              triggerOpen()
            }}
            maxLength={100}
            onBlur={(e) => {
              setTimeout(() => {
                setFocus(false)
                e.target.value = ''
                setValueInput('')
              }, 200)
            }}
            disabled={disabled}
            className={clsx(
              'infinite-select',
              selectedItem ? 'infinite-select-selected' : null
            )}
            ref={inputRef}
            onChange={(e) => {
              setLoading(true)
              clearTimeout(timeoutSearchRef.current)
              timeoutSearchRef.current = setTimeout(() => {
                setValueInput(e.target.value)
              }, TIMEOUT_SEARCH)
            }}
            placeholder={
              selectedItem
                ? customLabelPlaceHolder
                  ? customLabelPlaceHolder(selectedItem)
                  : selectedItem?.[labelField]
                : placeholder
            }
          />

          {isOpen ? (
            <div
              className={clsx(
                'absolute w-full left-0 bg-white overflow-hidden shadow-preview mt-2 z-5 transition-duration-100 rounded-lg bg-white shadow-2',
                trigger ? 'opacity-100' : 'opacity-0',
                dropdownClass
              )}
            >
              <div
                id={`scrollable${randomId.current}`}
                className="h-15rem overflow-y-scroll scrollbar-thin scrollbar-thumb-black-v3 scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
              >
                <InfiniteScroll
                  dataLength={optionSorted.length}
                  next={onLoadMore}
                  hasMore={hasMore}
                  loader={<div />}
                  scrollableTarget={`scrollable${randomId.current}`}
                >
                  {optionSorted?.map((option) => (
                    <OptionItem
                      key={option[valueField]}
                      label={option[labelField]}
                      value={option[valueField]}
                      onSelect={onSelectItem}
                      customRenderItem={customRenderItem}
                      item={option}
                      active={option[valueField] === selectedItem?.[valueField]}
                    />
                  ))}
                </InfiniteScroll>
                {!optionSorted?.length ? (
                  <div className="p-3 text-center text-secondary-500">
                    Không tìm thấy nội dung
                  </div>
                ) : null}
              </div>
              {loading ? <LoadingDot className="my-2" /> : null}{' '}
            </div>
          ) : null}
        </div>
      </ClickOutside>
    )
  }
)

export default InfiniteSelectMulti

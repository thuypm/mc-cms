import { BaseDataListResponse, LabeledValue } from 'Base'
import axiosInstant from 'api/baseRequest'
import clsx from 'clsx'
import LoadingDot from 'components/LoadingDot'
import { Button } from 'primereact/button'
import { Checkbox } from 'primereact/checkbox'
import { DropdownProps } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { RadioButton } from 'primereact/radiobutton'
import {
  ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { LIMIT_NOT_LAZY_SELECT } from 'utils/constants/commons-constant'
import { REACT_APP_SERVER_API } from 'utils/constants/environment'

interface FilterSelectProps extends DropdownProps {
  params?: any
  url?: string
  baseURL?: string
  method?: string
  items?: LabeledValue[]
  multiple?: boolean
  showFooter?: boolean
  useRadio?: boolean
  onChange?: (value: any, selectedItem?: any) => void
  customRender?: (item, active, onSelectItem: () => void) => ReactNode
  onSelectItem?: (
    value: any,
    selectedValues: string[],

    selectedItems: LabeledValue[],
    selectedItem?: any
  ) => void
  showSearch?: boolean
  // tranformData?: (data: any) => any[]
}
const FilterSelect = forwardRef((props: FilterSelectProps, ref: any) => {
  const {
    value,
    onSelectItem,
    multiple,
    showFooter,
    className,
    onChange,
    options,
    loading,
    useRadio,
    customRender,
    showSearch = true,
  } = props
  const [selected, setSelected] = useState<LabeledValue[]>([])

  const [search, setSearch] = useState('')
  useEffect(() => {}, [])
  const { t } = useTranslation()

  const dataRendered = useMemo(() => {
    if (search?.length)
      return options.filter((e) =>
        e.label?.trim().toLowerCase().includes(search.trim().toLowerCase())
      )
    else return options
  }, [options, search])

  useEffect(() => {
    setSelected(dataRendered.filter((e) => value?.includes(e.value)))
  }, [dataRendered, value])

  return (
    <div className={clsx(' filter-select', className ? className : 'w-24rem')}>
      {showSearch ? (
        <InputText
          value={search}
          className="mb-2 w-full"
          placeholder={t('Search')}
          onChange={(e) => {
            setSearch(e.target.value)
          }}
        />
      ) : null}

      <div className="max-h-24rem overflow-auto py-2 pr-2">
        {loading ? (
          <LoadingDot />
        ) : (
          dataRendered.map((item) => {
            const isActive = !!selected?.find((e) => e.value === item.value)

            return customRender ? (
              customRender(item, isActive, () => {
                let valueChange = null

                if (isActive)
                  valueChange = selected.filter((e) => e.value !== item.value)
                else {
                  if (multiple) {
                    valueChange = [...selected, item]
                  } else valueChange = [item]
                }
                onSelectItem &&
                  onSelectItem(
                    item.value,
                    valueChange.map((e) => e.value),
                    valueChange,
                    item
                  )
                setSelected(valueChange)
              })
            ) : (
              <div
                key={item.value}
                className="flex align-items-center px-2 py-2 gap-2 hover:bg-gray-100 cursor-pointer transition-duration-300"
                onClick={() => {
                  let valueChange = null

                  if (isActive)
                    valueChange = selected.filter((e) => e.value !== item.value)
                  else {
                    if (multiple) {
                      valueChange = [...selected, item]
                    } else valueChange = [item]
                  }

                  onSelectItem &&
                    onSelectItem(
                      item.value,
                      valueChange.map((e) => e.value),
                      valueChange,
                      item
                    )
                  setSelected(valueChange)
                }}
              >
                {useRadio ? (
                  <RadioButton onChange={null} checked={isActive} />
                ) : (
                  <Checkbox onChange={null} checked={isActive} />
                )}
                <p className="text-overflow-ellipsis white-space-nowrap overflow-hidden m-0">
                  {item.label}
                </p>
              </div>
            )
          })
        )}
      </div>
      {showFooter ? (
        <div className="flex justify-content-between align-items-center w-full my-4 filter-select-footer">
          <Button
            className="w-fit"
            type="button"
            onClick={() => {
              onChange([])
            }}
            outlined
            label={t('Clear')}
          />
          <Button
            className="w-fit"
            type="button"
            onClick={() => {
              onChange && onChange(selected.map((e) => e.value))

              document.dispatchEvent(
                new KeyboardEvent('keyup', {
                  altKey: false,
                  code: 'Escape',
                  ctrlKey: false,
                  isComposing: false,
                  key: 'Escape',
                  location: 0,
                  bubbles: true,
                  cancelable: true,
                  metaKey: false,
                  repeat: false,
                  shiftKey: false,
                  which: 27,

                  keyCode: 27,
                })
              )
            }}
            label={t('Apply')}
          />
        </div>
      ) : null}
    </div>
  )
})

export default FilterSelect

interface AllInOneSelectProps extends FilterSelectProps {
  params?: any
  url?: string
  baseURL?: string
  method?: string
  firstItems?: any[]
  tranformData?: (data: any) => any[]
}
export const FilterSelectLazy = forwardRef(
  (props: AllInOneSelectProps, ref: any) => {
    const {
      url = '/',
      baseURL = REACT_APP_SERVER_API,
      params,
      method = 'get',
      firstItems = [],
      tranformData,

      ...restProps
    } = props

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const getData = useCallback(async () => {
      setLoading(true)
      try {
        const { data } = await axiosInstant.request<BaseDataListResponse<any>>({
          url,
          method,
          baseURL,
          params: { limit: LIMIT_NOT_LAZY_SELECT, ...(params || {}) },
          // data: params ?? { limit: LIMIT_NOT_LAZY_SELECT },
        })
        setData(data.items)
      } catch (error) {
      } finally {
        setLoading(false)
      }
    }, [baseURL, method, params, url])

    useEffect(() => {
      getData()
    }, [getData])
    const dataRendered = useMemo(() => {
      return [...firstItems, ...(tranformData ? tranformData(data) : data)]
    }, [data, firstItems, tranformData])

    return (
      <FilterSelect
        ref={ref}
        options={dataRendered}
        optionLabel="name"
        filter
        panelClassName="w-25rem"
        loading={loading}
        optionValue="_id"
        className="w-full"
        {...restProps}
      />
    )
  }
)

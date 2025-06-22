import { BaseDataListResponse } from 'Base'
import axiosInstant from 'api/baseRequest'
import { Dropdown, DropdownProps } from 'primereact/dropdown'
import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LIMIT_NOT_LAZY_SELECT } from 'utils/constants/commons-constant'
import { REACT_APP_SERVER_API } from 'utils/constants/environment'

interface AllInOneSelectProps extends DropdownProps {
  params?: any
  url?: string
  baseURL?: string
  method?: string
  firstItems?: any[]
  onChange: (value: any, selectedItem?: any) => void
  tranformData?: (data: any) => any[]
}
const AllInOneSelect = forwardRef((props: AllInOneSelectProps, ref: any) => {
  const {
    url = '/',
    baseURL = REACT_APP_SERVER_API,
    params,
    method = 'get',
    firstItems = [],
    tranformData,
    onChange,
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
        params: { perPage: LIMIT_NOT_LAZY_SELECT, ...(params || {}) },
        // data: params ?? { perPage: LIMIT_NOT_LAZY_SELECT },
      })
      setData(data.data)
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
  const { t } = useTranslation()
  return (
    <Dropdown
      ref={ref}
      options={dataRendered}
      // optionLabel="value"
      filter
      panelClassName="w-25rem"
      loading={loading}
      // optionValue="label"
      className="w-full"
      emptyFilterMessage={t('No results founds')}
      emptyMessage={t('No available options')}
      onChange={(event) => {
        onChange &&
          onChange(
            event,
            dataRendered.find((e) => e._id === event?.target?.value)
          )
      }}
      {...restProps}
    />
  )
})
export default AllInOneSelect

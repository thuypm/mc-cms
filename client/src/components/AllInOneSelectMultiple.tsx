import { BaseDataListResponse } from 'Base'
import axiosInstant from 'api/baseRequest'
import { Button } from 'primereact/button'
import { MultiSelect, MultiSelectProps } from 'primereact/multiselect'
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { LIMIT_NOT_LAZY_SELECT } from 'utils/constants/commons-constant'
import { REACT_APP_SERVER_API } from 'utils/constants/environment'

interface AllInOneSelectMultipleProps extends MultiSelectProps {
  params?: any
  url?: string
  baseURL?: string
  method?: string
  firstItems?: any[]
  tranformData?: (data: any) => any[]
  onChange?: (value) => void
}
const AllInOneSelectMultiple = forwardRef(
  (props: AllInOneSelectMultipleProps, ref: any) => {
    const {
      url = '/',
      baseURL = REACT_APP_SERVER_API,
      params,
      method = 'get',
      firstItems = [],
      tranformData,
      value,
      onChange,
      ...restProps
    } = props
    const [data, setData] = useState([])
    const [selected, setSelected] = useState([])
    const [loading, setLoading] = useState(false)
    const getData = useCallback(async () => {
      setLoading(true)
      try {
        const { data } = await axiosInstant.request<BaseDataListResponse<any>>({
          url,
          method,
          baseURL,
          params: params ?? { perPage: LIMIT_NOT_LAZY_SELECT },
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

    useEffect(() => {
      setSelected(value ?? [])
    }, [value])
    const { t } = useTranslation()
    const panelFooterTemplate = () => {
      // const length = selectedCountries ? selectedCountries.length : 0;

      return (
        <div className="py-3 px-3 flex justify-content-between p-column-filter-buttonbar">
          <Button outlined onClick={() => setSelected([])}>
            {t('Clear')}
          </Button>
          <Button
            onClick={async () => {
              onChange(selected)
              await Promise.resolve()
              // setTimeout(() => {
              innerRef.current.hide()
              // }, 200)
            }}
          >
            {t('Apply')}
          </Button>
        </div>
      )
    }
    const innerRef = useRef(null)
    useImperativeHandle(ref, () => innerRef.current, [])
    return (
      <MultiSelect
        ref={innerRef}
        options={[...firstItems, ...(tranformData ? tranformData(data) : data)]}
        optionLabel="name"
        loading={loading}
        placeholder="Select a Country"
        filter
        onHide={() => {
          setSelected(value)
        }}
        emptyFilterMessage={t('No results founds')}
        emptyMessage={t('No available options')}
        optionValue="_id"
        panelClassName="w-25rem"
        className="w-full max-w-20rem "
        panelFooterTemplate={panelFooterTemplate}
        value={selected}
        onChange={(e) => {
          setSelected(e.target.value)
        }}
        {...restProps}
      />
    )
  }
)
export default AllInOneSelectMultiple

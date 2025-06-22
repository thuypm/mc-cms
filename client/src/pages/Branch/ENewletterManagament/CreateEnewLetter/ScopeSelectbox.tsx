import { BaseDataListResponse } from 'Base'
import axiosInstant from 'api/baseRequest'
import { Button } from 'primereact/button'
import { MultiSelect } from 'primereact/multiselect'
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
import { ScopeEnewLetter } from 'utils/constants/enewletter'
import { REACT_APP_SERVER_API } from 'utils/constants/environment'

interface ScopeSelectboxProps {
  params?: any
  url?: string
  baseURL?: string
  method?: string
  firstItems?: any[]
  tranformData?: (data: any) => any[]
  onChange: (value: { isSelectALl: boolean; selected: string[] }) => void
  value: {
    isSelectALl: boolean
    selected: string[]
  }
  placeholder?: string
  className?: string
  optionLabel?: string
}
const ScopeSelectbox = forwardRef((props: ScopeSelectboxProps, ref: any) => {
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
    setSelected(
      value.isSelectALl
        ? [...(value.selected || []), ScopeEnewLetter.All]
        : value.selected || []
    )
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
            onChange({
              isSelectALl: selected.includes(ScopeEnewLetter.All),
              selected: selected.filter((e) => e !== ScopeEnewLetter.All),
            })
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
      filter={!selected.includes(ScopeEnewLetter.All)}
      showSelectAll={!selected.includes(ScopeEnewLetter.All)}
      onHide={() => {
        setSelected(
          value.isSelectALl
            ? [...value.selected, ScopeEnewLetter.All]
            : value.selected
        )
      }}
      emptyFilterMessage={t('No results founds')}
      emptyMessage={t('No available options')}
      optionValue="_id"
      panelClassName="w-25rem"
      className="w-full max-w-20rem "
      panelFooterTemplate={panelFooterTemplate}
      value={selected}
      optionDisabled={(item) =>
        item._id !== ScopeEnewLetter.All &&
        selected.includes(ScopeEnewLetter.All)
      }
      onChange={(e) => {
        if (e.target.value?.includes(ScopeEnewLetter.All)) {
          setSelected([ScopeEnewLetter.All])
        } else {
          setSelected(e.target.value?.filter((e) => e !== ScopeEnewLetter.All))
        }
      }}
      {...restProps}
    />
  )
})
export default ScopeSelectbox

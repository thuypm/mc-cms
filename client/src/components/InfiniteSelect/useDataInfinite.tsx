import axiosInstant from 'api/baseRequest'
import { BaseDataList, BaseItem } from 'Base'
import { default as qs } from 'query-string'
import { Fetcher } from 'swr'
import useSWRInfinite from 'swr/infinite'
import { REACT_APP_SERVER_API } from 'utils/constants/environment'

interface SWRInfiniteOption {
  method?: string
  path?: string
  baseUrl?: string
  customResponseItem?: (value?: any) => any
  isActive?: boolean
  headers?: any
}
const defaultOptions: SWRInfiniteOption = {
  path: 'v1/projects',
  isActive: true,
}
export const useDataInfinite = <T extends BaseItem>(
  payload: any = {},
  options: SWRInfiniteOption = defaultOptions
) => {
  const fetcher: Fetcher<T[]> = async () => {
    const { data } = await axiosInstant.request<BaseDataList<BaseItem>>({
      baseURL: options.baseUrl ?? REACT_APP_SERVER_API,
      method: options.method,
      url: options.path,
      params: payload,
    })

    return data
      ? data.data?.map((item) =>
          options?.customResponseItem
            ? options.customResponseItem(item)
            : (item as unknown as T)
        )
      : []
  }

  const getKey = (pageIndex: number, previousPageData: any) => {
    if ((previousPageData && !previousPageData.length) || !options.isActive)
      return null // reached the end
    payload.page = pageIndex + 1
    const key = `${options.path}/page=${pageIndex + 1}&${qs.stringify(payload)}`
    return key
  }

  const result = useSWRInfinite(getKey, options.isActive ? fetcher : null, {
    revalidateAll: false,
    revalidateFirstPage: false,
    persistSize: false,
  })

  return result
}

// export default useSWRProjectFilterInfinite

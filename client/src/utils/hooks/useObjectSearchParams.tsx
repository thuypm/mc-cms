import queryString from 'query-string'
import { useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { skipEmptyObject } from 'utils/helper/common-helpers'

interface IUserSearchParmas {
  searchObject: any
  setRestSearchObject: (obj: any) => void
  setSearchObject: (obj: any) => void
}
export const useObjectSearchParams = (): IUserSearchParmas => {
  // const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const searchObject = useMemo(() => {
    return queryString.parse(location.search, { arrayFormat: 'none' })
  }, [location.search])

  const setRestSearchObject = useCallback(
    (object: any) => {
      navigate({
        pathname: location.pathname,
        search: queryString.stringify(
          skipEmptyObject({ ...searchObject, ...object }),
          { arrayFormat: 'none' }
        ),
      })
    },
    [location.pathname, navigate, searchObject]
  )

  const setSearchObject = useCallback(
    (object: any) => {
      navigate({
        pathname: location.pathname,
        search: queryString.stringify(skipEmptyObject(object), {
          arrayFormat: 'none',
        }),
      })
    },
    [location.pathname, navigate]
  )

  return { searchObject, setRestSearchObject, setSearchObject }
}

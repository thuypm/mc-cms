import axios from 'axios'
import { history } from 'context/store'
import i18n from 'i18n'
import Cookies from 'js-cookie'
import { REACT_APP_SERVER_API } from 'utils/constants/environment'
import { HTTP_STATUS_CODE } from 'utils/constants/http'
import { skipNullParams } from 'utils/helper/common-helpers'
import { toast } from 'utils/toast'

const axiosInstant = axios.create({})
const handleErrorcode = (errorResponse: any) => {
  switch (errorResponse?.status) {
    case HTTP_STATUS_CODE.UNAUTHORIZED:
      // localStorage.removeItem('accessToken')
      // localStorage.removeItem('refreshToken')

      history.push('/login')
      // notification.error({
      // 	message: ("Có lỗi xảy ra"),
      // 	description: ('error:401'),
      // 	placement: 'bottom',
      // })
      break
    case HTTP_STATUS_CODE.BAD_REQUEST:
      toast({
        severity: 'error',
        detail: errorResponse?.data?.message,
        summary: i18n.t('Error'),
      })
      break

    case HTTP_STATUS_CODE.FORBIDDEN:
      history.push('/403')
      break
    case HTTP_STATUS_CODE.NOT_FOUND:
      break
    case HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR:
      toast({
        severity: 'error',
        detail:
          'エラーが発生しました。しばらく待ってから、再度お試しください。',
        summary: i18n.t('Error'),
      })
      break
    case HTTP_STATUS_CODE.TOO_MANY_REQUESTS:
      break
    default:
      break
  }
}

let customHeader = {}

export const setCustomHeaders = (data) => {
  customHeader = data
}

axiosInstant.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    config.baseURL = REACT_APP_SERVER_API
    config.headers.set('Authorization', `Bearer ${Cookies.get('accessToken')}`)
    config.headers.set('Accept-Language', i18n.language === 'jp' ? 'ja' : 'en')
    config.params = skipNullParams(config.params)

    Object.keys(customHeader).forEach((key) => {
      config.headers.set(key, customHeader[key])
    })

    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

axiosInstant.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    handleErrorcode(error.response)
    return Promise.reject(error)
  }
)

export default axiosInstant

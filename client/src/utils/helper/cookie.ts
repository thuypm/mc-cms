import Cookies, { CookieAttributes } from 'js-cookie'
import { REACT_APP_PARENT_APP_DOMAIN } from 'utils/constants/environment'

export const getCookie = (key: string, option?: any) => {
  try {
    // @ts-ignore

    return JSON.parse(Cookies.get(key, option))
  } catch (error) {
    return null
  }
}
export const COOKIE_OPTIONS = {
  domain: `.${REACT_APP_PARENT_APP_DOMAIN}`,
  path: '/',
}
export const setCookie = (
  name: string,
  token?: any,
  options?: CookieAttributes
) => {
  if (!!token) {
    Cookies.set(
      name,
      JSON.stringify(token),
      options ?? {
        expires: 60 * 60 * 24 * 30,
        //domain: APP_DOMAIN
      }
    )
  } else {
    Cookies.remove(name, {
      //domain: APP_DOMAIN
    })
  }
}

export const deleteCookie = (name: string) => {
  Cookies.remove(name, {
    //domain: APP_DOMAIN
  })
}

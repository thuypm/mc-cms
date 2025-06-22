import axiosInstant from 'api/baseRequest'
import axios from 'axios'
import i18n from 'i18n'
import Cookies from 'js-cookie'
import { action, makeObservable, observable, runInAction } from 'mobx'
import { UserSyncData } from 'Models'
import {
  INTERVAL_refreshToken,
  REACT_APP_PARENT_APP_DOMAIN,
  REACT_APP_SERVER_API,
} from 'utils/constants/environment'
import { COOKIE_OPTIONS } from 'utils/helper/cookie'
import RootStore from './RootStore'

class AuthStore {
  rootStore: RootStore

  loadingLogin: boolean
  loadingCheckUser: boolean = true
  user: any
  // { _id: string; fullName: string; phone: string; email: string }
  intervalSync: any = null
  constructor(rootStore) {
    this.rootStore = rootStore

    makeObservable(this, {
      user: observable,
      loadingLogin: observable,
      loadingCheckUser: observable,

      changePassword: action,
      logout: action,
      fetchUser: action,
      // login: action,
      setUser: action,
    })
  }

  fetchUser = async () => {
    this.loadingCheckUser = true
    try {
      const { data } = await axiosInstant.request<UserSyncData>({
        url: '/api/v1/auth/me',
      })
      runInAction(() => {
        this.user = data
      })
      return data
    } catch (error) {
      throw error
    } finally {
      runInAction(() => {
        this.loadingCheckUser = false
      })
    }
  }

  logout = async () => {
    try {
      clearInterval(this.intervalSync)
      Cookies.remove('refreshToken', {
        domain: `.${REACT_APP_PARENT_APP_DOMAIN}`,
        path: '/',
      })
      Cookies.remove('accessToken', {
        domain: `.${REACT_APP_PARENT_APP_DOMAIN}`,
        path: '/',
      })
      window.location.reload()
    } catch (error) {
      throw error
    } finally {
    }
  }
  startSync = () => {
    try {
      this.intervalSync = setInterval(async () => {
        try {
          await this.refreshToken()
        } catch (error) {}
      }, INTERVAL_refreshToken)
    } catch (error) {}
  }
  refreshToken = async () => {
    try {
      const { data } = await axios.request<any>({
        url: '/api/v1/auth/refresh-token',
        method: 'post',
        baseURL: REACT_APP_SERVER_API,
        data: {
          refreshToken: Cookies.get('refreshToken'),
          'Accept-Language': i18n.language === 'jp' ? 'ja' : 'en',
        },
      })
      Cookies.set('accessToken', data.accessToken, COOKIE_OPTIONS)
      Cookies.set('refreshToken', data.refreshToken, COOKIE_OPTIONS)
    } catch (error) {
      throw error
    } finally {
    }
  }
  setUser = (value) => {
    this.user = value
  }
  changePassword = async (data: {
    oldPassword: string
    newPassword: string
    confirmPassword: string
  }) => {
    this.loadingLogin = true
    try {
    } catch (error) {
      // notification.error({
      //   message: 'Có lỗi xảy ra',
      //   description: error?.response?.data?.message,
      // })
      throw error
    } finally {
      runInAction(() => {
        this.loadingLogin = false
      })
    }
  }
}

export default AuthStore

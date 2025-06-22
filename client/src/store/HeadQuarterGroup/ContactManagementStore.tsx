import { BaseDataListResponse } from 'Base'
import { Thread } from 'Models'
import axiosInstant from 'api/baseRequest'
import i18n from 'i18n'
import { action, makeObservable, observable, runInAction } from 'mobx'
import { DEFAULT_PAGE_TABLE_SIZE } from 'utils/constants/commons-constant'
import { toast } from 'utils/toast'
import RootStore from '../RootStore'

class ContactManagementStore {
  rootStore: RootStore
  loadingListing: boolean
  loadingSubmit: boolean
  loadingDetail: boolean
  filterData = {
    page: 1,
    perPage: DEFAULT_PAGE_TABLE_SIZE,
    keyword: '',
  }
  hasNewMessages: boolean
  listData: BaseDataListResponse<Thread> = {
    meta: {
      perPage: DEFAULT_PAGE_TABLE_SIZE,
      page: 1,
      total: 0,
    },

    data: [],
  }

  selectedItem: Thread

  constructor(rootStore) {
    this.rootStore = rootStore

    makeObservable(this, {
      filterData: observable,
      loadingListing: observable,
      listData: observable,
      selectedItem: observable,
      loadingDetail: observable,
      loadingSubmit: observable,

      hasNewMessages: observable,

      handleFilterDataChange: action,
      create: action,
      fetchDetail: action,
      fetchList: action,
      readThread: action,
      setSelectedItem: action,
      getNewNotifMessage: action,
    })
  }

  handleFilterDataChange = (filterData: any) => {
    this.filterData = {
      // ...this.filterData,
      ...filterData,
    }

    this.fetchList()
  }

  fetchList = async () => {
    this.loadingListing = true
    try {
      const { data } = await axiosInstant.request({
        url: '/api/v1/thread',
        params: this.filterData,
      })
      runInAction(() => {
        this.listData = data
        this.filterData = {
          ...this.filterData,
          page: data.meta.page,
          perPage: data.meta.perPage,
        }
      })
    } catch (err) {
    } finally {
      runInAction(() => {
        this.loadingListing = false
      })
    }
  }
  setSelectedItem = (item) => {
    this.selectedItem = item
  }
  fetchDetail = async (id) => {
    this.loadingDetail = true
    try {
      const { data } = await axiosInstant.request({
        url: `/api/v1/message/${id}`,
      })
      runInAction(() => {
        this.selectedItem = data
      })
    } catch (err) {
      // throw err
    } finally {
      runInAction(() => {
        this.loadingDetail = false
      })
    }
  }
  create = async (data: any) => {
    this.loadingSubmit = true
    try {
      const res = await axiosInstant.request({
        url: `/api/v1/thread`,
        method: 'post',
        data,
      })
      toast({
        severity: 'success',
        detail: i18n.t('Created item', { item: i18n.t('Thread') }),
        summary: i18n.t('Success'),
      })
      return res
    } catch (err) {
      // toast({
      //   severity: 'error',
      //   detail: i18n.t(err?.response?.data?.message),
      //   summary: i18n.t('Error'),
      // })
      throw err
    } finally {
      runInAction(() => {
        this.loadingSubmit = false
      })
    }
  }

  readThread = async (id) => {
    try {
      await axiosInstant.request({
        url: `/api/v1/thread/read/${id}`,
        method: 'put',
      })
    } catch (err) {
      throw err
    } finally {
    }
  }

  getNewNotifMessage = async () => {
    try {
      const { data } = await axiosInstant.request({
        url: `/api/v1/thread/notification`,
        method: 'get',
      })

      runInAction(() => {
        this.hasNewMessages = data?.newMessages
      })
    } catch (err) {
    } finally {
    }
  }

  deleteItem = async (id: string) => {
    this.loadingListing = true
    try {
      await axiosInstant.request({
        url: `/api/v1/thread/${id}`,
        method: 'delete',
      })
      await this.fetchList()
      toast({
        severity: 'success',
        detail: i18n.t('Deleted item', { item: i18n.t('Thread') }),
        summary: i18n.t('Success'),
      })
    } catch (err) {
      // throw err
    } finally {
      runInAction(() => {
        this.loadingListing = false
      })
    }
  }
}

export default ContactManagementStore

import { BaseDataListResponse } from 'Base'
import { EventData } from 'Models'
import axiosInstant from 'api/baseRequest'
import i18n from 'i18n'
import { t } from 'i18next'
import { action, makeObservable, observable, runInAction } from 'mobx'
import { DEFAULT_PAGE_TABLE_SIZE } from 'utils/constants/commons-constant'
import { toast } from 'utils/toast'
import RootStore from '../RootStore'

class EventManagementStore {
  rootStore: RootStore
  loadingListing: boolean
  loadingSubmit: boolean
  loadingInvite: boolean
  loadingDetail: boolean
  filterData = {
    page: 1,
    perPage: DEFAULT_PAGE_TABLE_SIZE,
    keyword: '',
  }
  listData: BaseDataListResponse<EventData> = {
    meta: {
      perPage: DEFAULT_PAGE_TABLE_SIZE,
      page: 1,
      total: 0,
    },

    items: [],
  }

  selectedItem: EventData

  constructor(rootStore) {
    this.rootStore = rootStore

    makeObservable(this, {
      filterData: observable,
      loadingListing: observable,
      listData: observable,
      selectedItem: observable,
      loadingDetail: observable,
      loadingSubmit: observable,
      loadingInvite: observable,

      handleFilterDataChange: action,
      create: action,
      fetchDetail: action,
      fetchList: action,
      update: action,
      setSelectedItem: action,
      cancel: action,
      sendInvite: action,
    })
  }

  handleFilterDataChange = (filterData: any) => {
    this.filterData = {
      // ...this.filterData,
      ...filterData,
    }

    this.fetchList()
  }
  setSelectedItem = (item) => {
    this.selectedItem = item
  }
  fetchList = async () => {
    this.loadingListing = true
    try {
      const { data } = await axiosInstant.request({
        url: '/api/v1/event',
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

  fetchDetail = async (id) => {
    this.loadingDetail = true
    try {
      const { data } = await axiosInstant.request({
        url: `/api/v1/event/${id}`,
      })
      runInAction(() => {
        this.selectedItem = data
      })
    } catch (err) {
      // toast({
      //   severity: 'error',
      //   detail: i18n.t(err?.response?.data?.message),
      //   summary: i18n.t('Error'),
      // })
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
        url: `/api/v1/event`,
        method: 'post',
        data,
      })
      toast({
        severity: 'success',
        detail: i18n.t('Created item', {
          item: i18n.t('Event'),
        }),
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

  update = async (id, payload: any) => {
    this.loadingSubmit = true
    try {
      const res = await axiosInstant.request({
        url: `/api/v1/event/${id}`,
        method: 'put',
        data: payload,
      })
      toast({
        severity: 'success',
        detail: i18n.t('Updated item', { item: i18n.t('Event') }),
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

  activate = async (id, active: boolean) => {
    this.loadingSubmit = true
    try {
      const res = await axiosInstant.request({
        url: `/api/v1/event/${active ? 'active' : 'inactive'}/${id}`,
        method: 'put',
      })
      toast({
        severity: 'success',
        detail: i18n.t('Updated item', { item: i18n.t('Event') }),
        summary: i18n.t('Success'),
      })
      this.fetchDetail(id)
      return res
    } catch (err) {
      // toast({
      //   severity: 'error',
      //   detail: i18n.t(err?.response?.data?.message),
      //   summary: i18n.t('Error'),
      // })
      // throw err
    } finally {
      runInAction(() => {
        this.loadingSubmit = false
      })
    }
  }
  cancel = async (id, data) => {
    this.loadingSubmit = true
    try {
      const res = await axiosInstant.request({
        url: `/api/v1/event/cancel/${id}`,
        method: 'put',
        data,
      })
      toast({
        severity: 'success',
        detail: i18n.t('Canceled item', { item: i18n.t('Event') }),
        summary: i18n.t('Success'),
      })
      this.fetchDetail(id)
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
  sendInvite = async (id) => {
    this.loadingInvite = true
    try {
      const res = await axiosInstant.request({
        url: `/api/v1/event/invite/${id}`,
        method: 'put',
      })
      toast({
        severity: 'success',
        detail: i18n.t('Sent email'),
        summary: i18n.t('Success'),
      })

      return res
    } catch (err) {
      // toast({
      //   severity: 'error',
      //   detail: i18n.t(err?.response?.data?.message),
      //   summary: i18n.t('Error'),
      // })
      // throw err
    } finally {
      runInAction(() => {
        this.loadingInvite = false
      })
    }
  }
  deleteItem = async (id: string) => {
    this.loadingListing = true
    try {
      await axiosInstant.request({
        url: `/api/v1/event/${id}`,
        method: 'delete',
      })
      await this.fetchList()
      toast({
        severity: 'success',
        detail: i18n.t('Deleted item', { item: t('Event') }),
        summary: i18n.t('Success'),
      })
    } catch (err) {
      // toast({
      //   severity: 'error',
      //   detail: i18n.t(err?.response?.data?.message),
      //   summary: i18n.t('Error'),
      // })
      // throw err
      throw err
    } finally {
      runInAction(() => {
        this.loadingListing = false
      })
    }
  }
}

export default EventManagementStore

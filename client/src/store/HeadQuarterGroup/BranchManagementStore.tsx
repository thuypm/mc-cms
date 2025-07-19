import { BaseDataListResponse } from 'Base'
import { Branch } from 'Models'
import axiosInstant from 'api/baseRequest'
import i18n from 'i18n'
import { action, makeObservable, observable, runInAction } from 'mobx'
import { DEFAULT_PAGE_TABLE_SIZE } from 'utils/constants/commons-constant'
import { toast } from 'utils/toast'
import RootStore from '../RootStore'

class AdminManagementStore {
  rootStore: RootStore
  loadingListing: boolean
  loadingSubmit: boolean
  loadingDetail: boolean
  filterData = {
    page: 1,
    perPage: DEFAULT_PAGE_TABLE_SIZE,
    keyword: '',
  }
  listData: BaseDataListResponse<Branch> = {
    meta: {
      perPage: DEFAULT_PAGE_TABLE_SIZE,
      page: 1,
      total: 0,
    },

    items: [],
  }

  selectedItem: Branch

  constructor(rootStore) {
    this.rootStore = rootStore

    makeObservable(this, {
      filterData: observable,
      loadingListing: observable,
      listData: observable,
      selectedItem: observable,
      loadingDetail: observable,
      loadingSubmit: observable,

      handleFilterDataChange: action,
      create: action,
      fetchDetail: action,
      fetchList: action,
      update: action,
      setSelectedItem: action,
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
        url: '/api/v1/branches',
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
        url: `/api/v1/branches/${id}`,
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
        url: `/api/v1/branches`,
        method: 'post',
        data,
      })
      toast({
        severity: 'success',
        detail: i18n.t('Created item', { item: i18n.t('Branch') }),
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
      await axiosInstant.request({
        url: `/api/v1/branches/${id}`,
        method: 'put',
        data: payload,
      })
      toast({
        severity: 'success',
        detail: i18n.t('Updated item', { item: i18n.t('Branch') }),
        summary: i18n.t('Success'),
      })
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
        url: `/api/v1/branches/${active ? 'active' : 'inactive'}/${id}`,
        method: 'put',
      })
      toast({
        severity: 'success',
        detail: i18n.t('Updated item', { item: i18n.t('Branch Status') }),
        summary: i18n.t('Success'),
      })
      this.fetchDetail(id)
      return res
    } catch (err) {
      console.log(err)
      // throw err
    } finally {
      runInAction(() => {
        this.loadingSubmit = false
      })
    }
  }
  deleteItem = async (id: string) => {
    this.loadingListing = true
    try {
      await axiosInstant.request({
        url: `/api/v1/branches/${id}`,
        method: 'delete',
      })
      await this.fetchList()
      toast({
        severity: 'success',
        detail: i18n.t('Deleted item', { item: i18n.t('Branch') }),
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

export default AdminManagementStore

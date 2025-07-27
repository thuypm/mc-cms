import { BaseDataListResponse } from 'Base'
import { UserSyncData } from 'Models'
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
    limit: DEFAULT_PAGE_TABLE_SIZE,
    keyword: '',
  }
  listData: BaseDataListResponse<UserSyncData> = {
    meta: {
      limit: DEFAULT_PAGE_TABLE_SIZE,
      page: 1,
      total: 0,
    },

    items: [],
  }

  selectedItem: UserSyncData

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
  setSelectedItem = (item) => {
    this.selectedItem = item
  }
  fetchList = async () => {
    this.loadingListing = true
    try {
      const { data } = await axiosInstant.request({
        url: '/api/v1/admins',
        params: this.filterData,
      })
      runInAction(() => {
        this.listData = data
        this.filterData = {
          ...this.filterData,
          page: data.meta.page,
          limit: data.meta.limit,
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
        url: `/api/v1/admins/${id}`,
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
        url: `/api/v1/admins`,
        method: 'post',
        data,
      })
      toast({
        severity: 'success',
        detail: i18n.t('Invited admin'),
        summary: i18n.t('Success'),
      })
      return res
    } catch (err) {
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
        url: `/api/v1/admins/${id}`,
        method: 'put',
        data: payload,
      })
      toast({
        severity: 'success',
        detail: i18n.t('Updated item', { item: i18n.t('Admin') }),
        summary: i18n.t('Success'),
      })
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

  activate = async (id, active: boolean) => {
    this.loadingSubmit = true
    try {
      const res = await axiosInstant.request({
        url: `/api/v1/admins/${active ? 'active' : 'inactive'}/${id}`,
        method: 'put',
      })
      toast({
        severity: 'success',
        detail: i18n.t('Updated item', { item: i18n.t('Admin') }),
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
        url: `/api/v1/admins/${id}`,
        method: 'delete',
      })
      await this.fetchList()
      toast({
        severity: 'success',
        detail: i18n.t('Deleted item', { item: i18n.t('Admin') }),
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

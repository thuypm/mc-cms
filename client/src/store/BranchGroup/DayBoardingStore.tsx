import { BaseDataListResponse } from 'Base'
import { EnewLetter } from 'Models'
import axiosInstant from 'api/baseRequest'
import i18n from 'i18n'
import { action, makeObservable, observable, runInAction } from 'mobx'
import { DEFAULT_PAGE_TABLE_SIZE } from 'utils/constants/commons-constant'
import { toast } from 'utils/toast'
import RootStore from '../RootStore'

class DayBoardingStore {
  rootStore: RootStore
  loadingListing: boolean
  loadingSubmit: boolean
  loadingDetail: boolean
  filterData = {
    page: 1,
    perPage: DEFAULT_PAGE_TABLE_SIZE,
    keyword: '',
  }
  listData: BaseDataListResponse<EnewLetter> = {
    meta: {
      perPage: DEFAULT_PAGE_TABLE_SIZE,
      page: 1,
      total: 0,
    },

    items: [],
  }

  selectedItem: []

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
        url: '/api/day-boarding/get-day-data',
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

  fetchDetail = async (query) => {
    this.loadingDetail = true
    try {
      const { data } = await axiosInstant.request({
        url: `/api/day-boarding/get-all-register`,
        params: query,
      })
      runInAction(() => {
        this.selectedItem = data.data
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
        url: `/api/v1/newsletter`,
        method: 'post',
        data,
      })
      toast({
        severity: 'success',
        detail: i18n.t('Created item', { item: i18n.t('E-Newsletter') }),
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

  update = async (payload: any) => {
    this.loadingSubmit = true
    try {
      const res = await axiosInstant.request({
        url: `/api/day-boarding/register`,
        method: 'post',
        data: payload,
      })
      toast({
        severity: 'success',
        detail: 'Đã đăng ký dịch vụ thành công',
        summary: 'Thành công',
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

  deleteItem = async (id: string) => {
    this.loadingListing = true
    try {
      await axiosInstant.request({
        url: `/api/v1/newsletter/${id}`,
        method: 'delete',
      })
      await this.fetchList()
      toast({
        severity: 'success',
        detail: i18n.t('Deleted item', { item: i18n.t('E-Newsletter') }),
        summary: i18n.t('Success'),
      })
    } catch (err) {
      throw err
    } finally {
      runInAction(() => {
        this.loadingListing = false
      })
    }
  }

  createDayData = async (selectedDaterange) => {
    try {
      const res = await axiosInstant.request({
        url: `/api/day-boarding/create-day-data`,
        method: 'post',
        data: selectedDaterange,
      })
      await this.fetchList()
      toast({
        severity: 'success',
        detail: 'Tạo thành công',
        summary: 'Thành công',
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
}

export default DayBoardingStore

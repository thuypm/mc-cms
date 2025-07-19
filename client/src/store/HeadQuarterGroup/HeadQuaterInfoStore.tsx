import { BaseDataListResponse } from 'Base'
import { HeadquarterInfoData } from 'Models'
import axiosInstant from 'api/baseRequest'
import i18n from 'i18n'
import { action, makeObservable, observable, runInAction } from 'mobx'
import { DEFAULT_PAGE_TABLE_SIZE } from 'utils/constants/commons-constant'
import { toast } from 'utils/toast'
import RootStore from '../RootStore'

class HeadQuaterInfoStore {
  rootStore: RootStore
  loadingListing: boolean
  loadingSubmit: boolean
  loadingDetail: boolean
  loadingFilder: boolean
  filterData = {
    page: 1,
    perPage: DEFAULT_PAGE_TABLE_SIZE,
    keyword: '',
  }
  listData: BaseDataListResponse<HeadquarterInfoData> = {
    meta: {
      perPage: DEFAULT_PAGE_TABLE_SIZE,
      page: 1,
      total: 0,
    },

    items: [],
  }

  selectedItem: HeadquarterInfoData

  constructor(rootStore) {
    this.rootStore = rootStore

    makeObservable(this, {
      filterData: observable,
      loadingListing: observable,
      listData: observable,
      selectedItem: observable,
      loadingDetail: observable,
      loadingSubmit: observable,
      loadingFilder: observable,

      fetchDetail: action,
      update: action,
      setSelectedItem: action,
    })
  }

  setSelectedItem = (item) => {
    this.selectedItem = item
  }
  fetchDetail = async () => {
    this.loadingDetail = true
    try {
      const { data } = await axiosInstant.request({
        url: `/api/v1/information/`,
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
  handleFilterBranchInfomation = async (filterData: any) => {
    this.loadingDetail = true
    try {
      const { data } = await axiosInstant.request({
        url: `/api/v1/information/`,
        params: filterData ?? null,
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
  update = async (payload: any) => {
    this.loadingSubmit = true
    try {
      await axiosInstant.request({
        url: `/api/v1/information/`,
        method: 'post',
        data: payload,
      })
      toast({
        severity: 'success',
        detail: i18n.t('Updated item', { item: i18n.t('Headquarter Info') }),
        summary: i18n.t('Success'),
      })
    } catch (err) {
      // throw err
    } finally {
      runInAction(() => {
        this.loadingSubmit = false
      })
    }
  }
}

export default HeadQuaterInfoStore

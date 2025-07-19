import { BaseDataListResponse } from 'Base'
import { RegistrationEventData, RegistrationHistoryData } from 'Models'
import axiosInstant from 'api/baseRequest'
import i18n from 'i18n'
import { action, makeObservable, observable, runInAction } from 'mobx'
import { DEFAULT_PAGE_TABLE_SIZE } from 'utils/constants/commons-constant'
import { toast } from 'utils/toast'
import RootStore from '../RootStore'

interface EventRegistraion {
  title: 'Event test 3'
  maxRegistrationsEvent: 302
  registeredQuantityEvent: 5
  registeredCount: 5
  canceledCount: 1
  invalidMailCount: 1
  timeslots: {
    startTime: '2024-06-30T06:33:21.193Z'
    endTime: '2024-06-30T06:53:21.193Z'
    maxRegistrations: 2
    registeredQuantity: 1
    _id: '666986380e8d5437c59ce0f8'
  }[]
}
class EventRegistrationStore {
  rootStore: RootStore
  loadingListing: boolean
  loadingSubmit: boolean
  loadingDetail: boolean
  filterData = {
    page: 1,
    perPage: DEFAULT_PAGE_TABLE_SIZE,
    keyword: '',
  }
  currentEvent: EventRegistraion
  listData: BaseDataListResponse<RegistrationEventData> = {
    meta: {
      perPage: DEFAULT_PAGE_TABLE_SIZE,
      page: 1,
      total: 0,
    },

    items: [],
  }

  registrationHistory: BaseDataListResponse<RegistrationHistoryData> = {
    meta: {
      perPage: DEFAULT_PAGE_TABLE_SIZE,
      page: 1,
      total: 0,
    },

    items: [],
  }

  selectedItem: RegistrationEventData
  contextId

  constructor(rootStore) {
    this.rootStore = rootStore

    makeObservable(this, {
      filterData: observable,
      loadingListing: observable,
      listData: observable,
      selectedItem: observable,
      loadingDetail: observable,
      loadingSubmit: observable,
      contextId: observable,
      currentEvent: observable,
      registrationHistory: observable,

      handleFilterDataChange: action,
      exportListRegistration: action,
      fetchDetail: action,
      fetchList: action,
      update: action,
      setSelectedItem: action,
      setContextId: action,
      block: action,
    })
  }

  handleFilterDataChange = (filterData: any) => {
    this.filterData = {
      // ...this.filterData,
      ...filterData,
    }

    this.fetchList()
  }
  setContextId = (id) => {
    this.contextId = id
  }
  setSelectedItem = (item) => {
    this.selectedItem = item
  }
  fetchList = async () => {
    this.loadingListing = true
    try {
      const { data } = await axiosInstant.request({
        url: `/api/v1/reservation/event/${this.contextId}`,
        params: this.filterData,
      })
      runInAction(() => {
        this.listData = data
        this.currentEvent = data.event
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
        url: `/api/v1/reservation/${id}`,
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
  block = async (id, block: boolean) => {
    this.loadingSubmit = true
    try {
      const res = await axiosInstant.request({
        url: `/api/v1/customer/${block ? 'block' : 'unblock'}/${id}`,
        method: 'put',
      })

      toast({
        severity: 'success',
        detail: i18n.t(
          block
            ? 'Customer blocked successfully'
            : 'Customer unblocked successfully',
          {
            item: i18n.t('Customer'),
          }
        ),
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
        url: `/api/v1/reservation/edit/${id}`,
        method: 'put',
        data: payload,
      })
      toast({
        severity: 'success',
        detail: i18n.t('Updated item', { item: i18n.t('Registration') }),
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
  exportListRegistration = async () => {
    this.loadingDetail = true
    try {
      const { data } = await axiosInstant.request({
        url: `/api/v1/reservation/export/${this.contextId}`,
        responseType: 'blob',
      })
      const href = URL.createObjectURL(data)

      // create "a" HTML element with href to file & click
      const link = document.createElement('a')
      link.href = href
      link.download = `${this.currentEvent.title} - ${i18n.t('Registration list')}.csv`
      // link.setAttribute(
      //   'download',
      //   `${this.selectedItem.event.title} - ${i18n.t('Registration list')}.csv`
      // )
      link.setAttribute('reservations.xlsx', 'file.xlsx') //or any other extension
      document.body.appendChild(link)
      link.click()

      // clean up "a" element & remove ObjectURL
      document.body.removeChild(link)
      URL.revokeObjectURL(href)
    } catch (err) {
      console.log(err)
      // throw err
    } finally {
      runInAction(() => {
        this.loadingDetail = false
      })
    }
  }

  deleteItem = async (id: string) => {
    this.loadingListing = true
    try {
      await axiosInstant.request({
        url: `/api/v1/reservation/event/${this.contextId}/${id}`,
        method: 'delete',
      })
      await this.fetchList()
      toast({
        severity: 'success',
        detail: i18n.t('Deleted item', { item: i18n.t('Registration') }),
        summary: i18n.t('Success'),
      })
    } catch (err) {
      // throw err
    } finally {
    }
  }
}

export default EventRegistrationStore

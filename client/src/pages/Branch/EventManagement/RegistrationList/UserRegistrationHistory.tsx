import { BaseDataListResponse } from 'Base'
import { RegistrationHistoryData } from 'Models'
import axiosInstant from 'api/baseRequest'
import FilterSelect from 'components/InfiniteSelect/FilterSelect'
import dayjs from 'dayjs'
import { data } from 'pages/HeadQuarter/HeadQuarterInformation/DonutCharts'
import { FilterMatchMode } from 'primereact/api'
import { Button } from 'primereact/button'
import { Column, ColumnProps } from 'primereact/column'
import { ConfirmDialogProps } from 'primereact/confirmdialog'
import { DataTable, DataTableFilterMetaData } from 'primereact/datatable'
import { Paginator } from 'primereact/paginator'
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { DATE_TIME_FORMAT } from 'utils/constants/datetime'
import { EventStatusEnum, RegistrationStatusEnum } from 'utils/constants/event'
import { getEventStatusTag, getRegistrationStatusTag } from 'utils/helper/table'

export interface ActionColumn {
  key?: string
  icon?: ReactNode
  showConfirm?: ConfirmDialogProps
  tooltip?: ReactNode
  href?: (data?: any) => string
  action?: (data?: any) => void
  disabled?: (data?: any) => boolean
}

export interface BaseManagemenColumnProps extends ColumnProps {
  dataIndex?: string
  key?: string
  filterKey?: string
  width?: any
}
export interface IUserRegistrationHistoryProps {
  userId?: string
}
const UserRegistrationHistory = ({ userId }: IUserRegistrationHistoryProps) => {
  const { t } = useTranslation()
  const [filterData, setFilterData] = useState({
    page: 1,
    sort: null,
    filter: null,
    sortBy: null,
  })
  const [loading, setLoading] = useState(false)
  const [dataList, setDataList] = useState<
    BaseDataListResponse<RegistrationHistoryData>
  >({
    meta: {},
    data: [],
  })
  const columns = useMemo<BaseManagemenColumnProps[]>(() => {
    return [
      {
        key: 'event',
        dataIndex: 'event',
        header: t('Event name'),
        body: (item, d) =>
          item.event?.[0]?.deleted ? (
            item.event?.[0]?.title
          ) : (
            <Link
              target="_blank"
              className="text-blue-500 underline"
              to={`/event-management/${item.event?.[0]?._id}`}
            >
              {item.event?.[0]?.title}{' '}
            </Link>
          ),
        width: '30%',
      },
      {
        key: 'location',
        dataIndex: 'location',
        header: t('Location'),

        body: (item, d) => item.event?.[0].location,
        width: '25%',
      },
      {
        key: 'timeslot',
        dataIndex: 'timeslot',
        sortable: true,
        header: t('Time slot'),
        body: (data) =>
          `${dayjs(data.timeslot?.startTime).format(DATE_TIME_FORMAT.HOUR)}-${dayjs(data.timeslot?.endTime).format(DATE_TIME_FORMAT.HOUR)} ${dayjs(data.event?.[0].startTimeEvent).format(DATE_TIME_FORMAT.DAY_ONLY)}`,
        width: '15%',
      },
      {
        key: 'event-status',
        header: t('Status'),
        filter: true,
        filterElement: (options) => {
          return (
            <FilterSelect
              options={Object.values(EventStatusEnum).map((e) => ({
                label: t(e),
                value: e,
              }))}
              showSearch={false}
              value={options.value}
              onSelectItem={(_, value) => {
                options.filterCallback(value, options.index)
              }}
              onChange={(e) => {
                options.filterApplyCallback(e, options.index)
              }}
              placeholder={t('Select One')}
            />
          )
        },
        width: '120px',

        showFilterMatchModes: false,
        filterField: 'eventStatus',
        filterMatchMode: 'contains',
        body: (item, d) => getEventStatusTag(item.event?.[0].status),
      },
      {
        key: 'guest',
        dataIndex: 'guest',
        header: t('Guest'),
        width: '10%',
      },
      {
        key: 'status',
        dataIndex: 'status',
        header: t('Registration Status'),
        body: (item) => getRegistrationStatusTag(item.status),
        filter: true,
        filterElement: (options) => {
          return (
            <FilterSelect
              options={Object.values(RegistrationStatusEnum).map((e) => ({
                label: t(e),
                value: e,
              }))}
              showSearch={false}
              value={options.value}
              onSelectItem={(_, value) => {
                options.filterCallback(value, options.index)
              }}
              onChange={(e) => options.filterApplyCallback(e, options.index)}
              placeholder={t('Select One')}
            />
          )
        },
        filterApply: (options) => {
          return (
            <Button
              label={t('Apply')}
              onClick={options.filterApplyCallback}
            ></Button>
          )
        },
        filterClear: (options) => {
          return (
            <Button
              outlined
              label={t('Clear')}
              onClick={options.filterClearCallback}
            ></Button>
          )
        },
        showFilterMatchModes: false,
        filterField: 'reservationStatus',
        filterMatchMode: 'contains',
        width: '120px',
      },
    ]
  }, [t])
  const filters = useMemo(() => {
    const obj: any = {}
    columns
      .filter((col) => col.filter)
      .forEach((col) => {
        obj[col.filterField ?? col.key] = {
          value: filterData[col.filterField],
          matchMode: FilterMatchMode.CUSTOM,
        }
      })
    // Object.keys(searchObject).forEach((key) => {
    //   if (key !== 'page' && key !== 'perPage' && key !== 'sortBy') {
    //     obj[key] = {
    //       value: searchObject[key],
    //       matchMode: FilterMatchMode.CUSTOM,
    //     }
    //   }
    // })
    // console.log(obj)
    return obj
  }, [columns, filterData])

  const getData = useCallback(async () => {
    try {
      setLoading(true)
      const { data } = await axiosInstant.request({
        url: `/api/v1/reservation/history/${userId}`,
        params: filterData,
      })
      setDataList(data)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }, [filterData, userId])

  const sortObject = useMemo<any>(() => {
    const sortArray = filterData.sortBy ? filterData.sortBy?.split(':') : []
    if (sortArray.length)
      return {
        sortField: sortArray[0]?.replaceAll('"', ''),
        sortOrder: Number(sortArray[1]),
      }
    else return {}
  }, [filterData.sortBy])

  useEffect(() => {
    getData()
  }, [getData])
  const handleFilterDataChange = (filter) => {
    setFilterData({ ...filterData, ...filter })
  }

  return (
    <div className="card bg-white border-round-xl p-3 pb-6">
      {/* {filterComponent} */}
      <DataTable
        value={dataList?.data}
        className="mt-3"
        removableSort
        loading={loading}
        emptyMessage={t('No available options')}
        filters={filters}
        loadingIcon={
          <div className="absolute w-full h-full">
            <div className="skeleton-container">
              <div className="skeleton-placeholder skeleton-title"></div>
              <div className="skeleton-placeholder skeleton-content"></div>
              <div className="skeleton-placeholder skeleton-content"></div>
              <div className="skeleton-placeholder skeleton-content"></div>
              <div className="skeleton-placeholder skeleton-content"></div>
              <div className="skeleton-placeholder skeleton-content"></div>
            </div>
          </div>
        }
        onFilter={(e) => {
          const valueObject = {}

          Object.keys(e.filters).forEach((key) => {
            valueObject[key] = (
              e.filters[key] as DataTableFilterMetaData
            )?.value
          })
          // console.log(valueObject)
          // setRestSearchObject(valueObject)
          handleFilterDataChange(valueObject)
        }}
        lazy
        {...sortObject}
        onSort={(e) => {
          handleFilterDataChange({
            sortBy: e.sortOrder ? `"${e.sortField}":${e.sortOrder}` : null,
          })
        }}

        // metaKeySelection={metaKey}
        // tableStyle={{ minWidth: '50rem' }}
      >
        {columns.map((col) => (
          <Column
            {...col}
            field={col.dataIndex ?? col.key}
            style={
              col.width
                ? {
                    width: col.width,
                  }
                : null
            }
            key={col.key}
            filterApply={(options) => {
              return (
                <Button
                  label={t('Apply')}
                  onClick={options.filterApplyCallback}
                ></Button>
              )
            }}
            filterClear={(options) => {
              return (
                <Button
                  outlined
                  label={t('Clear')}
                  onClick={options.filterClearCallback}
                ></Button>
              )
            }}
          ></Column>
        ))}
      </DataTable>
      {!loading && dataList && dataList.meta?.total && dataList.meta?.page ? (
        <Paginator
          first={(dataList.meta.page - 1) * dataList.meta.perPage}
          rows={dataList.meta.perPage}
          totalRecords={dataList.meta.total}
          template={{
            layout:
              'CurrentPageReport FirstPageLink PrevPageLink  PageLinks NextPageLink LastPageLink RowsPerPageDropdown',
            CurrentPageReport: (options) => {
              return (
                <span>
                  {options.first} - {options.last} of {options.totalRecords}
                </span>
              )
            },
          }}
          rowsPerPageOptions={[10, 20, 50]}
          onPageChange={(e) =>
            handleFilterDataChange({
              page: e.page + 1,
              perPage: e.rows,
            })
          }
          className="justify-content-center"
        />
      ) : null}
    </div>
  )
}
export default UserRegistrationHistory

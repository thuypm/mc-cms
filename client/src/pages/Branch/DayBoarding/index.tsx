import BaseManagementComponent from 'components/BaseManagementComponent'
import { useStore } from 'context/store'
import dayjs from 'dayjs'
import { observer } from 'mobx-react'
import { Button } from 'primereact/button'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useObjectSearchParams } from 'utils/hooks/useObjectSearchParams'
import SuperAdminDayBoarding from './SuperAdminDayBoarding'
import WeekFilter from './WeekFilter'
const dayHeaders = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
const DayBoarding = () => {
  const {
    dayBoardingStore: {
      loadingListing,
      handleFilterDataChange,
      deleteItem,
      listData: { items, meta },
    },
  } = useStore()
  const columnsWeekDay = useMemo(() => {
    return dayHeaders.map((day) => ({
      key: day,
      header: day,
      body: (rowData: any) => {
        return rowData[day]?.status
      },
    }))
  }, [])
  const { searchObject, setRestSearchObject } = useObjectSearchParams()
  if (!searchObject.startDate || !searchObject.endDate) {
    setRestSearchObject({
      startDate: dayjs().startOf('isoWeek').toISOString(),
      endDate: dayjs().startOf('isoWeek').add(6, 'day').toISOString(),
    } as any)
  }

  const tranformData = useMemo(() => {
    const resultMap = new Map()

    items.forEach((item: any) => {
      const studentId = item.student
      const day = new Date(item.date).getDay() // 0 (Sun) → 6 (Sat)
      const dayKey = dayHeaders[day === 0 ? 6 : day - 1] // Chuyển về T2–CN

      if (!resultMap.has(studentId)) {
        resultMap.set(studentId, {
          studentId,
          studentInfo: item.studentInfo,
          [dayKey]: {
            updatedAt: item.updatedAt,
            registedBy: item.registedBy,
            status: item.status,
            date: new Date(item.date).toISOString(),
          },
        })
      } else {
        const existing = resultMap.get(studentId)
        existing[dayKey] = {
          updatedAt: item.updatedAt,
          registedBy: item.registedBy,
          status: item.status,
          date: new Date(item.date).toISOString(),
        }
      }
    })

    return Array.from(resultMap.values())
  }, [items])
  return (
    <BaseManagementComponent
      dataSource={tranformData}
      triggerFirstLoad={
        searchObject.startDate && searchObject.endDate && searchObject.classId
      }
      loading={loadingListing}
      actionColumns={[
        {
          key: 'view',
          icon: <i className="isax-eye"></i>,
          href: (item) => `/enewletter-management/${item._id}`,
          tooltip: 'View',
        },
        {
          key: 'clone',
          icon: <i className="isax-copy"></i>,
          href: (item) => `/enewletter-management/create?cloneId=${item._id}`,
          tooltip: 'Clone Enewletter',
        },
        {
          key: 'delete',
          icon: <i className="isax-trash"></i>,
          showConfirm: {},
          action: (data) => {
            deleteItem(data._id)
          },
          tooltip: 'Delete',
        },
      ]}
      columns={[
        {
          key: 'ID',
          header: 'Mã HS',
          body: (rowData: any) => {
            return rowData.studentInfo?.code
          },
        },
        {
          key: 'name',
          header: 'Họ và tên',
          body: (rowData: any) => {
            return rowData.studentInfo?.name
          },
        },
        {
          key: 'class',
          header: 'Lớp',
        },
        ...columnsWeekDay,
        // {
        //   key: 'status',
        //   dataIndex: 'status',
        //   header: 'Status',

        //   filter: true,
        //   width: '100px',
        //   filterElement: (options) => {
        //     return (
        //       <FilterSelect
        //         // options={Object.values(EnewLetterStatusEnum).map((key) => ({
        //         //   label: t(key),
        //         //   value: key,
        //         // }))}
        //         className="w-20rem"
        //         multiple={false}
        //         value={options.value}
        //         onSelectItem={(_, value) => {
        //           options.filterCallback(value, options.index)
        //         }}
        //         showSearch={false}
        //         onChange={(e) => options.filterApplyCallback(e, options.index)}
        //         placeholder={'Select One'}
        //       />
        //     )
        //   },
        //   showFilterMatchModes: false,
        //   filterField: 'status',
        //   filterMatchMode: 'contains',
        // },
      ]}
      pagination={{
        ...meta,
      }}
      handleFilterDataChange={handleFilterDataChange}
      filterComponent={
        <div>
          <div className="flex justify-content-between align-items-center flex-wrap">
            <h1 className="text-xl font-bold">Đăng ký BT hàng ngày</h1>
            <div className="flex gap-3 flex-wrap">
              <Button label={'Cập nhật'}></Button>
              <Link to={'create'}>
                <Button icon="pi pi-plus" label={'Đăng ký dịch vụ'}></Button>
              </Link>
            </div>
          </div>
          <SuperAdminDayBoarding />
          <WeekFilter />
        </div>
      }
    />
  )
}
export default observer(DayBoarding)

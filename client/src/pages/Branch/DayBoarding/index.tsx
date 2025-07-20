import { useStore } from 'context/store'
import dayjs from 'dayjs'
import { observer } from 'mobx-react'
import { Button } from 'primereact/button'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useObjectSearchParams } from 'utils/hooks/useObjectSearchParams'
import FormTable from './FormTable'
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

  const { searchObject, setRestSearchObject } = useObjectSearchParams()

  if (!searchObject.startDate || !searchObject.endDate) {
    setRestSearchObject({
      startDate: dayjs().startOf('isoWeek').toISOString(),
      endDate: dayjs().startOf('isoWeek').add(6, 'day').toISOString(),
    } as any)
  }

  useEffect(() => {
    if (searchObject && searchObject.startDate && searchObject.endDate) {
      handleFilterDataChange && handleFilterDataChange(searchObject)
    }
  }, [handleFilterDataChange, searchObject])
  return (
    <div className="flex flex-column overflow-auto h-full">
      <div className="mb-4 flex-shrink-0">
        <div className="flex justify-content-between align-items-center flex-wrap">
          <h1 className="text-xl font-bold">Đăng ký BT hàng ngày</h1>
          <div className="flex gap-3 flex-wrap align-items-center">
            <WeekFilter />
            <div>
              <Button label={'Cập nhật'}></Button>
            </div>
            <Link to={'create'}>
              <Button icon="pi pi-plus" label={'Đăng ký dịch vụ'}></Button>
            </Link>
          </div>
        </div>
        <SuperAdminDayBoarding />
      </div>
      <div className="overflow-auto flex-1">
        <FormTable items={items} loadingListing={loadingListing} />
      </div>
    </div>
  )
}
export default observer(DayBoarding)

import { useStore } from 'context/store'
import { WorkspaceContext } from 'context/workspace.context'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import utc from 'dayjs/plugin/utc'
import { observer } from 'mobx-react'
import { Button } from 'primereact/button'
import { useContext, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { USER_ROLE_ENUM } from 'utils/constants/user'
import { useObjectSearchParams } from 'utils/hooks/useObjectSearchParams'
import FormTable from './FormTable'
import SuperAdminDayBoarding from './SuperAdminDayBoarding'
import WeekFilter from './WeekFilter'
dayjs.extend(utc)
dayjs.extend(isoWeek)
const DayBoarding = () => {
  const {
    dayBoardingStore: {
      loadingListing,
      handleFilterDataChange,
      listData: { items },
    },
  } = useStore()
  const { user } = useContext(WorkspaceContext)
  const { searchObject } = useObjectSearchParams()

  useEffect(() => {
    if (searchObject && searchObject.startDate && searchObject.endDate) {
      if (
        user.position !== USER_ROLE_ENUM.SUPER_ADMIN ||
        (user.position === USER_ROLE_ENUM.SUPER_ADMIN && searchObject.classId)
      ) {
        handleFilterDataChange && handleFilterDataChange(searchObject)
      }
    }
  }, [handleFilterDataChange, searchObject, user.position])

  const formRef = useRef(null)
  return (
    <div className="flex flex-column overflow-auto h-full">
      <div className="mb-4 flex-shrink-0">
        <div className="flex justify-content-between align-items-center flex-wrap">
          <h1 className="text-xl font-bold">Đăng ký BT hàng ngày</h1>
          <div className="flex gap-3 flex-wrap align-items-center">
            <WeekFilter />
            <div>
              <Button
                label={'Cập nhật'}
                onClick={() => {
                  formRef.current?.onSubmit()
                }}
              ></Button>
            </div>
            <Link to={'create'}>
              <Button icon="pi pi-plus" label={'Đăng ký dịch vụ'}></Button>
            </Link>
          </div>
        </div>
        <SuperAdminDayBoarding />
      </div>
      <div className="overflow-auto flex-1">
        <FormTable
          items={items}
          loadingListing={loadingListing}
          ref={formRef}
        />
      </div>
    </div>
  )
}
export default observer(DayBoarding)

import AllInOneSelect from 'components/AllInOneSelect'
import { useStore } from 'context/store'
import dayjs from 'dayjs'
import { observer } from 'mobx-react'
import { useEffect } from 'react'
import { useObjectSearchParams } from 'utils/hooks/useObjectSearchParams'
import CreateDayBoardingData from './CreateDayBoardingData'

const SuperAdminDayBoarding = () => {
  const {
    dayBoardingStore: { totalCount, fetchTotalCount },
  } = useStore()
  const { searchObject, setRestSearchObject } = useObjectSearchParams()
  useEffect(() => {
    if (searchObject.startDate && searchObject.endDate)
      fetchTotalCount(searchObject.startDate, searchObject.endDate)
  }, [fetchTotalCount, searchObject.endDate, searchObject.startDate])
  return (
    <div className="flex gap-3 flex-wrap mt-2">
      <div>
        <div className="flex gap-2 align-items-center">
          <div>Hôm nay: {dayjs().format('DD/MM/YYYY')}</div>
          <div className="bg-green-100 p-1 border-round">
            Đăng ký: <strong> {totalCount.registered}</strong>
          </div>
          <div className="bg-red-100 p-1 border-round">
            Nghỉ: <strong>{totalCount.cancel} </strong>
          </div>
        </div>
        <div className="bg-yellow-100 p-1 border-round w-fit">
          Chưa đăng ký:<strong> {totalCount.empty} </strong>
        </div>
      </div>

      {/* <InputSearchKeyword placeholder="Tìm kiếm" /> */}
      <AllInOneSelect
        placeholder="Chọn lớp"
        className="w-15rem"
        url={'/api/student/get-all-class'}
        optionLabel="name"
        optionValue="_id"
        value={searchObject?.classId}
        selectFirstItem={!searchObject?.classId}
        onChange={function (value: any, selectedItem?: any): void {
          setRestSearchObject({
            classId: value?._id || value,
          })
        }}
      />
      <CreateDayBoardingData />
    </div>
  )
}
export default observer(SuperAdminDayBoarding)

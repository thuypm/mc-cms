import AllInOneSelect from 'components/AllInOneSelect'
import InputSearchKeyword from 'components/InputSearchKeyword'
import { useStore } from 'context/store'
import { observer } from 'mobx-react'
import { useMemo } from 'react'
import CreateDayBoardingData from './CreateDayBoardingData'
const dayHeaders = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
const SuperAdminDayBoarding = () => {
  const {
    dayBoardingStore: {
      loadingListing,
      handleFilterDataChange,
      deleteItem,
      listData: { data, meta },
    },
  } = useStore()
  const columnsWeekDay = useMemo(() => {
    return dayHeaders.map((day) => ({
      key: day,
      header: day, // hoặc giữ nguyên day nếu không cần dịch
    }))
  }, [])
  return (
    <div className="flex gap-3 flex-wrap mt-2">
      <InputSearchKeyword placeholder="Tìm kiếm" />
      <AllInOneSelect
        placeholder="Chọn lớp"
        className="w-15rem"
        url={'/api/student/get-all-class'}
        optionLabel="name"
        optionValue="_id"
        onChange={function (value: any, selectedItem?: any): void {
          throw new Error('Function not implemented.')
        }} // selectFirstItem={true}
        //   value={selectedClass}
        //   onChange={onChange}
      />
      <CreateDayBoardingData />
    </div>
  )
}
export default observer(SuperAdminDayBoarding)

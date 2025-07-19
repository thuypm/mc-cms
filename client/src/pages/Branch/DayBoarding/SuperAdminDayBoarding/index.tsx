import AllInOneSelect from 'components/AllInOneSelect'
import InputSearchKeyword from 'components/InputSearchKeyword'
import { useStore } from 'context/store'
import { observer } from 'mobx-react'
import { useObjectSearchParams } from 'utils/hooks/useObjectSearchParams'
import CreateDayBoardingData from './CreateDayBoardingData'

const SuperAdminDayBoarding = () => {
  const {
    dayBoardingStore: {
      listData: { items, meta },
    },
  } = useStore()
  const { searchObject, setRestSearchObject } = useObjectSearchParams()
  return (
    <div className="flex gap-3 flex-wrap mt-2">
      <InputSearchKeyword placeholder="Tìm kiếm" />
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

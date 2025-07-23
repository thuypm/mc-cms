import AllInOneSelect from 'components/AllInOneSelect'
import { observer } from 'mobx-react'
import { useObjectSearchParams } from 'utils/hooks/useObjectSearchParams'
import CreateDayBoardingData from './CreateDayBoardingData'
import TableTotalCount from './TableTotalCount'

const SuperAdminDayBoarding = () => {
  const { searchObject, setRestSearchObject } = useObjectSearchParams()

  return (
    <div className="flex gap-3 flex-wrap mt-2">
      <TableTotalCount />

      {/* <InputSearchKeyword placeholder="Tìm kiếm" /> */}
      <div>
        <div className="flex gap-2 mb-3">
          <AllInOneSelect
            placeholder="Chọn lớp"
            className="w-15rem h-fit"
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

        {/* <Paginator /> */}
      </div>
    </div>
  )
}
export default observer(SuperAdminDayBoarding)

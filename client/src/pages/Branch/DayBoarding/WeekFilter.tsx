import { useStore } from 'context/store'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import { Button } from 'primereact/button'
import { useState } from 'react'
import { DATE_TIME_FORMAT } from 'utils/constants/datetime'

dayjs.extend(isoWeek)

const WeekFilter = () => {
  const {
    dayBoardingStore: { filterData },
  } = useStore()

  const [dateRangeObject, setDateRangeObject] = useState<{
    startDate: dayjs.Dayjs
    endDate: dayjs.Dayjs
  }>({
    startDate: dayjs().startOf('isoWeek'), // Thứ 2
    endDate: dayjs().startOf('isoWeek').add(6, 'day'),
  })

  return (
    <div className="my-2 flex gap-4">
      <Button icon="pi-backward pi"></Button>
      <div className="flex align-items-center">
        <div>Tuần {1} &nbsp; </div>
        <div>
          ({dateRangeObject.startDate.format(DATE_TIME_FORMAT.DAY_ONLY)} -
          {dateRangeObject.endDate.format(DATE_TIME_FORMAT.DAY_ONLY)})
        </div>
      </div>
      <Button icon="pi-forward pi"></Button>
    </div>
  )
}
export default WeekFilter

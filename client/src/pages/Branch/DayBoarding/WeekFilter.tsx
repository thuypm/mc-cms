import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import { Button } from 'primereact/button'
import { useEffect } from 'react'
import { DATE_TIME_FORMAT } from 'utils/constants/datetime'
import { getCurrentWeekRange } from 'utils/helper/common-helpers'
import { useObjectSearchParams } from 'utils/hooks/useObjectSearchParams'

dayjs.extend(isoWeek)

const WeekFilter = () => {
  const { searchObject, setRestSearchObject } = useObjectSearchParams()
  useEffect(() => {
    if (!searchObject.startDate || !searchObject.endDate) {
      const weekArr = getCurrentWeekRange()
      setRestSearchObject({
        startDate: weekArr[0].toISOString(),
        endDate: weekArr[1].toISOString(),
      } as any)
    }
  }, [searchObject?.endDate, searchObject?.startDate, setRestSearchObject])

  const handleChangeWeek = (direction: 'prev' | 'next') => {
    const offset = direction === 'prev' ? -7 : 7

    const newStart = dayjs(searchObject.startDate).add(offset, 'day')
    const newEnd = dayjs(searchObject.endDate).add(offset, 'day')

    setRestSearchObject({
      startDate: newStart.toISOString(),
      endDate: newEnd.toISOString(),
    })
  }

  return (
    <div className="my-2 flex gap-4">
      <Button
        icon="pi pi-backward"
        type="button"
        onClick={() => handleChangeWeek('prev')}
      />
      <div className="flex align-items-center">
        <div>Tuần {1} &nbsp;</div>
        <div>
          ({dayjs(searchObject.startDate).format(DATE_TIME_FORMAT.DAY_ONLY)} -{' '}
          {dayjs(searchObject.endDate).format(DATE_TIME_FORMAT.DAY_ONLY)})
        </div>
      </div>
      <Button
        icon="pi pi-forward"
        type="button"
        onClick={() => handleChangeWeek('next')}
      />
    </div>
  )
}

export default WeekFilter

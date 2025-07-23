import { useStore } from 'context/store'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { observer } from 'mobx-react'
import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { Dialog } from 'primereact/dialog'
import { useState } from 'react'
import { getCurrentWeekRange } from 'utils/helper/common-helpers'
dayjs.extend(utc)

const getDateRangeArray = (start: Date, end: Date): Date[] => {
  const result: Date[] = []
  let current = new Date(start)
  while (current <= end) {
    result.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }
  return result
}

const CreateDayBoardingData = () => {
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const {
    dayBoardingStore: { createDayData },
  } = useStore()

  const [dates, setDates] = useState<Date[]>(getCurrentWeekRange())

  return (
    <>
      <Button
        icon="isax-document-upload"
        className="h-fit"
        label={'Tạo dữ liệu'}
        outlined
        onClick={() => setShowModal(true)}
      ></Button>
      <Dialog
        onHide={() => {
          setShowModal(false)
        }}
        headerClassName="pt-4"
        header={'Chọn ngày để tạo dữ liệu'}
        visible={showModal}
        contentClassName="flex flex-column gap-3 overflow-auto"
      >
        <Calendar
          value={dates}
          dateFormat="dd/mm/yy"
          onChange={(e) => setDates(e.value)}
          selectionMode="range"
        />
        <div>
          <Button
            loading={loading}
            onClick={async () => {
              setLoading(true)
              try {
                const fullDates = getDateRangeArray(dates[0], dates[1])
                await createDayData({
                  dates: fullDates.map((d) => d.toISOString()),
                })
                setShowModal(false)
              } catch (error) {
              } finally {
                setLoading(false)
              }
            }}
          >
            Tạo
          </Button>
        </div>
      </Dialog>
    </>
  )
}

export default observer(CreateDayBoardingData)

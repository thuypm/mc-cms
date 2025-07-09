import { useStore } from 'context/store'
import { observer } from 'mobx-react'
import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { Dialog } from 'primereact/dialog'
import { useState } from 'react'
const getLast7Days = () => {
  const today = new Date()
  const days = []

  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    days.push(d)
  }

  return days.reverse() // từ cũ đến mới
}
const CreateDayBoardingData = () => {
  const [showModal, setShowModal] = useState(true)
  const [loading, setLoading] = useState(false)
  const {
    dayBoardingStore: { createDayData },
  } = useStore()
  const [dates, setDates] = useState<Date[]>(getLast7Days())
  return (
    <>
      <Button
        icon="isax-document-upload"
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
          readOnlyInput
          hideOnRangeSelection
        />
        <div>
          <Button
            loading={loading}
            onClick={async () => {
              setLoading(true)
              try {
                await createDayData({
                  dates: dates.map((e) => e.toISOString()),
                })
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

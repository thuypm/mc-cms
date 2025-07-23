import { useStore } from 'context/store'
import dayjs from 'dayjs'
import { observer } from 'mobx-react'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { useEffect, useMemo } from 'react'
import { useObjectSearchParams } from 'utils/hooks/useObjectSearchParams'
// 3. Map status sang label
const statusLabels: Record<number, string> = {
  1: 'ĐK',
  0: 'Chưa ĐK',
  [-1]: 'Hủy',
}
const dataMap = new Map<number, Record<string, number>>()

const TableTotalCount = () => {
  const { searchObject } = useObjectSearchParams()
  const {
    dayBoardingStore: { totalCount, fetchTotalCount },
  } = useStore()

  useEffect(() => {
    if (searchObject.startDate && searchObject.endDate) {
      fetchTotalCount(searchObject.startDate, searchObject.endDate)
    }
  }, [fetchTotalCount, searchObject.startDate, searchObject.endDate])

  const start = dayjs(searchObject.startDate)
  const end = dayjs(searchObject.endDate)

  // 1. Tạo mảng ngày từ start đến end
  const dates: string[] = []
  for (
    let d = start;
    d.isBefore(end, 'day') || d.isSame(end, 'day');
    d = d.add(1, 'day')
  ) {
    dates.push(d.format('YYYY-MM-DD'))
  }
  totalCount.forEach((item) => {
    const countMap: Record<string, number> = {}
    item.counts.forEach((c) => {
      const key = dayjs(c.date).format('YYYY-MM-DD')
      countMap[key] = c.count
    })
    dataMap.set(item._id, countMap)
  })
  // 2. Tạo map: status -> { dateString: count }

  // 4. Tạo rows cho DataTable
  const rows = useMemo(() => {
    return [1, 0, -1].map((status) => {
      const row: any = {
        status: statusLabels[status],
      }
      dates.forEach((dateStr) => {
        row[dateStr] = dataMap.get(status)?.[dateStr] ?? 0
      })
      return row
    })
  }, [dates])

  return (
    <DataTable value={rows} className="data-table-total-count">
      <Column
        field="status"
        header="Status"
        frozen
        style={{ minWidth: '100px' }}
      />
      {dates.map((dateStr) => {
        const label = dayjs(dateStr)
        const day = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][label.day()]
        const isToday = dateStr === dayjs().format('YYYY-MM-DD')
        return (
          <Column
            key={dateStr}
            field={dateStr}
            header={`${day}(${label.format('DD/MM')})`}
            style={{
              textAlign: 'center',
              backgroundColor: isToday ? '#e6f3ff' : undefined, // đỏ nhạt
            }}
          />
        )
      })}
    </DataTable>
  )
}

export default observer(TableTotalCount)

import { observer } from 'mobx-react'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Tag } from 'primereact/tag'
import { useEffect, useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import StatusTagSelect from './StatusTagSelect'
const dayHeaders = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
const FormTable = ({ items, loadingListing }) => {
  const { control, reset } = useForm({
    defaultValues: {
      items: [],
    },
  })

  const values = useWatch({
    control,
    name: 'items',
  })

  const transformData = useMemo(() => {
    const resultMap = new Map()
    values.forEach((item: any, index) => {
      const studentId = item.student
      const day = new Date(item.date).getDay() // 0 (Sun) → 6 (Sat)
      const dayKey = dayHeaders[day === 0 ? 6 : day - 1] // Chuyển về T2–CN
      if (!resultMap.has(studentId)) {
        resultMap.set(studentId, {
          studentId,
          studentInfo: item.studentInfo,
          [dayKey]: {
            rootIndex: index,
            updatedAt: item.updatedAt,
            registedBy: item.registedBy,
            status: item.status,
            date: new Date(item.date).toISOString(),
          },
        })
      } else {
        const existing = resultMap.get(studentId)
        existing[dayKey] = {
          updatedAt: item.updatedAt,
          registedBy: item.registedBy,
          status: item.status,
          date: new Date(item.date).toISOString(),
        }
      }
    })

    return Array.from(resultMap.values())
  }, [values])
  useEffect(() => {
    reset({
      items: items,
    })
  }, [items, reset])
  return (
    <DataTable
      value={transformData}
      paginator={true}
      rows={40}
      rowClassName={() => 'hover-highlight'}
      loading={loadingListing}
      className="register-dayboarding-table"
    >
      <Column
        field="studentInfo.code"
        header="Mã HS"
        body={(rowData: any) => rowData.studentInfo?.code}
      />
      <Column field="studentInfo.name" header="Họ và tên" />
      <Column field="studentInfo.classInfo.name" header="Lớp" />
      {dayHeaders.map((day) => (
        <Column
          key={day}
          field={day}
          filter={true}
          header={
            <div>
              <div className="text-center">{day}</div>
              <div className="flex align-items-center gap-1">
                <Tag className="cursor-pointer" severity="success" value="ĐK" />
                <Tag severity="danger" className="cursor-pointer" value="Hủy" />
              </div>
            </div>
          }
          body={(rowData: any) => <StatusTagSelect />}
        />
      ))}
    </DataTable>
  )
}
export default observer(FormTable)

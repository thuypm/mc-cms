import { useStore } from 'context/store'
import dayjs from 'dayjs'
import { observer } from 'mobx-react'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Tag } from 'primereact/tag'
import { forwardRef, useEffect, useImperativeHandle, useMemo } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useObjectSearchParams } from 'utils/hooks/useObjectSearchParams'
import StatusTagSelect from './StatusTagSelect'

const dayHeaders = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

const getDateByIndex = (startDate: string | Date, dayIndex: number): string => {
  return dayjs(startDate).add(dayIndex, 'day').format('DD/MM')
}

const FormTable = forwardRef(({ items, loadingListing }: any, ref) => {
  const { control, reset, getValues, handleSubmit } = useForm({
    defaultValues: {
      items: [],
    },
  })
  const {
    dayBoardingStore: { handleUpdateDayRegister },
  } = useStore()
  const values = useWatch({
    control,
    name: 'items',
  })

  // ✅ expose submit to parent via ref
  useImperativeHandle(ref, () => ({
    onSubmit: () => {
      handleSubmit((data) => {
        handleUpdateDayRegister(
          data.items.map((item) => ({ _id: item._id, status: item.status }))
        )
      })()
    },
  }))

  const transformData = useMemo(() => {
    const resultMap = new Map()
    values.forEach((item: any, index) => {
      const studentId = item.student
      const day = new Date(item.date).getDay()
      const dayKey = dayHeaders[day === 0 ? 6 : day - 1]

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
          rootIndex: index,
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

  const {
    searchObject: { startDate },
  } = useObjectSearchParams()

  return (
    <DataTable
      value={transformData}
      paginator
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
      {dayHeaders.map((day, dayIndex) => (
        <Column
          key={day}
          field={day}
          filter
          header={
            <div>
              <div className="text-center">
                <strong>{day}</strong> ({getDateByIndex(startDate, dayIndex)})
              </div>
              <div className="flex align-items-center gap-1">
                <Tag
                  className="cursor-pointer"
                  severity="success"
                  value="ĐK"
                  onClick={() => {
                    const currentValues = getValues()
                    const newArray = currentValues.items?.map((item) => {
                      const d = new Date(item.date).getDay()
                      if (d === (dayIndex + 1) % 7)
                        return { ...item, status: 1 }
                      return item
                    })
                    reset({ items: newArray })
                  }}
                />
                <Tag
                  className="cursor-pointer"
                  severity="danger"
                  value="Hủy"
                  onClick={() => {
                    const currentValues = getValues()
                    const newArray = currentValues.items?.map((item) => {
                      const d = new Date(item.date).getDay()
                      if (d === (dayIndex + 1) % 7)
                        return { ...item, status: -1 }
                      return item
                    })
                    reset({ items: newArray })
                  }}
                />
              </div>
            </div>
          }
          body={(rowData: any) =>
            rowData[day] && (
              <Controller
                control={control}
                name={`items.${rowData[day].rootIndex}.status`}
                render={({ field }) => (
                  <StatusTagSelect
                    status={field.value}
                    onChange={(v) => field.onChange(v)}
                  />
                )}
              />
            )
          }
        />
      ))}
    </DataTable>
  )
})

export default observer(FormTable)

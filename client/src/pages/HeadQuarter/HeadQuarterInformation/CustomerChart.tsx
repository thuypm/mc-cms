import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import { useStore } from 'context/store'
import dayjs from 'dayjs'
import groupBy from 'lodash.groupby'
import { observer } from 'mobx-react'
import { Card } from 'primereact/card'
import { Dropdown } from 'primereact/dropdown'
import { useMemo, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const CustomerChart = () => {
  const { t } = useTranslation()
  const {
    headQuarterInfoStore: {
      selectedItem: { customer },
    },
  } = useStore()

  const groupsYears = useMemo(() => {
    const arrayMonth = groupBy(customer.byMonth, (item) => item.year)
    return arrayMonth
  }, [customer.byMonth])

  const [year, setYear] = useState(`${new Date().getFullYear()}`)
  const tranferData = useMemo(() => {
    const currentMonthData = groupsYears[year]
    let arrayMonthData = []
    const arrayMonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
      (m) =>
        new Date(currentMonthData?.[0]?.year ?? new Date().getFullYear(), m - 1)
    )
    for (let i = 0; i < arrayMonth.length; i++) {
      const item = arrayMonth[i]
      const datum = currentMonthData?.find(
        (e) => e.month - 1 === item.getMonth()
      )

      if (datum)
        arrayMonthData.push({
          month: item,
          customerCount: datum.customerCount,
        })
      else if (item.getTime() < new Date().getTime())
        arrayMonthData.push({
          month: item,
          customerCount: 0,
        })
      else
        arrayMonthData.push({
          month: item,
          eventCount: null,
        })
    }

    return arrayMonthData
  }, [groupsYears, year])
  const labels = useMemo(() => {
    return tranferData.map((month) => dayjs(month.month).format('MMM'))
  }, [tranferData])
  return (
    <div className=" mt-3">
      <Card
        title={
          <div className="flex justify-content-between">
            <p>
              {t('Customers in', {
                year: ` ${year}`,
              })}
            </p>
            <p>
              <Dropdown
                className="p-0"
                onChange={(e) => setYear(e.value)}
                value={year}
                options={Object.keys(groupsYears).map((key) => ({
                  label: key,
                  value: key,
                }))}
              />
            </p>
          </div>
        }
        className="w-full"
        style={{
          boxShadow: '0px 4px 30px 0px #DDE0FF8A',
        }}
      >
        <Line
          width={'100%'}
          height={'500px'}
          options={{
            // responsive: false,
            maintainAspectRatio: false,

            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              y: {
                // The axis for this scale is determined from the first letter of the id as `'x'`
                // It is recommended to specify `position` and / or `axis` explicitly.

                ticks: {
                  precision: 0,
                },
              },
            },
          }}
          data={{
            labels,

            datasets: [
              {
                label: t('Customer'),
                data: tranferData.map((m) => m.customerCount),
                borderColor: '#f97316',
                backgroundColor: '#822854',
                borderWidth: 4,
              },
            ],
          }}
        />
      </Card>
    </div>
  )
}

export default observer(CustomerChart)

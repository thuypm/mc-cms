import {
  ArcElement,
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
import { observer } from 'mobx-react'
import { useMemo } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'

import { CustomerStatusEnum } from 'utils/constants/customer'
import { getCustomerStatusTag } from 'utils/helper/table'
import CardChart from './CardChart'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,

  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const CustomerDonut = () => {
  const { t } = useTranslation()
  const {
    headQuarterInfoStore: {
      selectedItem: { customer },
    },
  } = useStore()
  const dataCustomerDonut = useMemo(() => {
    return {
      datasets: [
        {
          data: Object.values(CustomerStatusEnum).map(
            (stt) => customer.overall.find((item) => item.status === stt)?.count
          ),
          backgroundColor: Object.values(CustomerStatusEnum).map((stt) => {
            switch (stt) {
              case CustomerStatusEnum.Active:
                return '#a0e6ba'
              case CustomerStatusEnum.Blocked:
                return '#f7b0d3'

              default:
                return '#f7b0d3'
            }
          }),
        },
      ],
      labels: Object.values(CustomerStatusEnum).map((stt) => t(stt)),
    }
  }, [customer.overall, t])
  return (
    <CardChart title={t('Customer')} className="w-full">
      <Doughnut
        width={'240px'}
        height={'240px'}
        className="mx-auto"
        plugins={[
          {
            id: 'text-center',
            beforeDraw: function (chart) {
              const total = customer.overall.reduce((current, v) => {
                return current + v.count
              }, 0)
              var width = chart.width,
                height = chart.height,
                ctx = chart.ctx
              ctx.restore()
              ctx.textAlign = 'center'
              ctx.font = '700 40px Noto Sans'
              // ctx.textBaseline = 'top'
              var text = `${total}`,
                textX = Math.round(width / 2),
                textY = height / 2 - 28
              ctx.fillText(text, textX, textY)

              ctx.restore()
              ctx.font = '16px Noto Sans'
              ctx.textBaseline = 'top'
              ctx.fillText(t('顧客の総数'), textX, textY + 44)

              ctx.save()
            },
          },
        ]}
        options={{
          cutout: 80,
          responsive: false,
          plugins: {
            legend: {
              display: false,
            },
          },
        }}
        data={dataCustomerDonut}
      />
      <div className="flex justify-content-center w-full gap-4 mt-4">
        {Object.values(CustomerStatusEnum).map((stt) => (
          <div className="flex gap-2 " key={stt}>
            {getCustomerStatusTag(stt)}
            <span className="font-bold">
              {customer.overall.find((item) => item.status === stt)?.count ?? 0}
            </span>
          </div>
        ))}
      </div>
    </CardChart>
  )
}

export default observer(CustomerDonut)

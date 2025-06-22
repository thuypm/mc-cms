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
import { BranchStatusEnum } from 'utils/constants/branch'
import { getBranchStatusTag } from 'utils/helper/table'
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

const BranchDonut = () => {
  const { t } = useTranslation()
  const {
    headQuarterInfoStore: {
      selectedItem: { branch },
    },
  } = useStore()
  const dataBranchDonut = useMemo(() => {
    return {
      datasets: [
        {
          data: Object.values(BranchStatusEnum).map(
            (stt) => branch.find((item) => item.status === stt)?.count
          ),
          backgroundColor: Object.values(BranchStatusEnum).map((stt) => {
            switch (stt) {
              case BranchStatusEnum.Active:
                return '#a0e6ba'
              case BranchStatusEnum.Inactive:
                return '#f7b0d3'

              default:
                return '#f7b0d3'
            }
          }),
        },
      ],
      labels: Object.values(BranchStatusEnum).map((stt) => t(stt)),
    }
  }, [branch, t])
  return (
    <CardChart title={t('Branch')} className="w-full">
      <Doughnut
        width={'240px'}
        height={'240px'}
        className="mx-auto"
        plugins={[
          {
            id: 'text-center',
            beforeDraw: function (chart) {
              const total = branch.reduce((current, v) => {
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
              ctx.fillText(t('支部の総数'), textX, textY + 44)
              // ctx.fillText(t(''), textX, textY + 56)

              ctx.save()
            },
          },
        ]}
        options={{
          responsive: false,
          cutout: 80,
          plugins: {
            legend: {
              display: false,
            },
          },
        }}
        data={dataBranchDonut}
      />
      <div className="flex justify-content-center w-full gap-4 mt-4">
        {Object.values(BranchStatusEnum).map((stt) => (
          <div className="flex gap-2 " key={stt}>
            {getBranchStatusTag(stt)}
            <span className="font-bold">
              {branch.find((item) => item.status === stt)?.count ?? 0}
            </span>
          </div>
        ))}
      </div>
    </CardChart>
  )
}

export default observer(BranchDonut)

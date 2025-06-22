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
import { EventStatusEnum } from 'utils/constants/event'
import { getEventStatusTag } from 'utils/helper/table'
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

const EventDonut = () => {
  const { t } = useTranslation()
  const {
    headQuarterInfoStore: {
      selectedItem: { event },
    },
  } = useStore()
  const dataEventDonut = useMemo(() => {
    return {
      datasets: [
        {
          data: Object.values(EventStatusEnum).map(
            (stt) => event.overall.find((item) => item.status === stt)?.count
          ),
          backgroundColor: Object.values(EventStatusEnum).map((stt) => {
            switch (stt) {
              case EventStatusEnum.Open:
                return '#a0e6ba'
              case EventStatusEnum.OnGoing:
                return '#f7b0d3'
              case EventStatusEnum.UpComming:
                return '#fcc39b'
              case EventStatusEnum.Finished:
                return '#abc9fb'
              case EventStatusEnum.Canceled:
                return '#d0d5dd'
              default:
                return 'red'
            }
          }),
        },
      ],
      labels: Object.values(EventStatusEnum).map((stt) => t(stt)),
    }
  }, [event.overall, t])
  return (
    <CardChart title={t('Event')} style={{ width: 480 }} className="w-full">
      <Doughnut
        width={'240px'}
        height={'240px'}
        className="mx-auto"
        plugins={[
          {
            id: 'text-center',
            beforeDraw: function (chart) {
              const total = event.overall.reduce((current, v) => {
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
              ctx.fillText(t('予約の総数'), textX, textY + 44)

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
        data={dataEventDonut}
      />
      <div className="flex justify-content-center w-full gap-4 mt-4 flex-wrap">
        {Object.values(EventStatusEnum).map((stt) => (
          <div className="flex gap-2 " key={stt}>
            {getEventStatusTag(stt)}
            <span className="font-bold">
              {event.overall.find((item) => item.status === stt)?.count ?? 0}
            </span>
          </div>
        ))}
      </div>
    </CardChart>
  )
}

export default observer(EventDonut)

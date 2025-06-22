import clsx from 'clsx'
import { useStore } from 'context/store'
import { observer } from 'mobx-react'
import { Card } from 'primereact/card'
import { useTranslation } from 'react-i18next'

const TopTenBranch = () => {
  const {
    headQuarterInfoStore: {
      selectedItem: { branchInformation },
    },
  } = useStore()
  const { t } = useTranslation()
  return (
    <div className=" mt-3 mb-4">
      <Card
        title={t('Top 10 branch')}
        className="w-full"
        style={{
          boxShadow: '0px 4px 30px 0px #DDE0FF8A',
        }}
      >
        <div className="w-fit">
          <table className="top-ten-table w-auto">
            <tbody>
              <tr>
                <th>{t('No.')}</th>
                <th>{t('Branch')}</th>
                <th>{t('Event')}</th>
                <th>{t('Customer')}</th>
              </tr>
              {branchInformation.data.map((item, index) => (
                <tr key={index} className={clsx(index < 3 ? 'bold-text' : '')}>
                  <td style={{ width: 64 }}>{index + 1}</td>
                  <td style={{ width: 40 }}>{item.name}</td>
                  <td style={{ width: 80, textAlign: 'right' }}>
                    {item.totalEvent} {t('events')}
                  </td>
                  <td style={{ width: 80, textAlign: 'right' }}>
                    {item.totalCustomer} {t('customers')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default observer(TopTenBranch)

import BaseManagementComponent from 'components/BaseManagementComponent'
import { useStore } from 'context/store'
import { observer } from 'mobx-react'
import { Card } from 'primereact/card'
import { useTranslation } from 'react-i18next'

const TopBranch = () => {
  const {
    headQuarterInfoStore: {
      selectedItem: { branchInformation },
      handleFilterBranchInfomation,
    },
  } = useStore()
  const { t } = useTranslation()
  return (
    <div className=" mt-3 mb-4">
      <Card
        title={t('All branch information')}
        className="w-full"
        style={{
          boxShadow: '0px 4px 30px 0px #DDE0FF8A',
        }}
      >
        <BaseManagementComponent
          dataSource={branchInformation.data}
          pagination={branchInformation?.meta}
          handleFilterDataChange={handleFilterBranchInfomation}
          columns={[
            {
              key: 'name',
              dataIndex: 'name',
              header: t('Branch name'),
              sortable: true,
              width: '50%',
            },
            {
              key: 'totalEvent',
              dataIndex: 'totalEvent',
              header: t('Total Event'),
              sortable: true,
            },
            {
              key: 'totalCustomer',
              dataIndex: 'totalCustomer',
              header: t('Total Customer'),
              sortable: true,
            },
          ]}
          showActionColumn={false}
        />
      </Card>
    </div>
  )
}

export default observer(TopBranch)

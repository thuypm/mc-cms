import Empty from 'components/Empty'
import FieldDetail from 'components/FieldDetail'
import { useStore } from 'context/store'
import { observer } from 'mobx-react'
import { Button } from 'primereact/button'
import { ProgressSpinner } from 'primereact/progressspinner'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { formatPhone } from 'utils/helper/common-helpers'
import { getUserStatusTag } from 'utils/helper/table'
import DonutCharts from './DonutCharts'
import EventChart from './EventChart'
import CustomerChart from './CustomerChart'
import TopTenBranch from './TopTenBranch'
import { Divider } from 'primereact/divider'
import TopBranch from './TopBranch'

const HeadQuarterInformation = () => {
  const { t } = useTranslation()
  const {
    headQuarterInfoStore: {
      fetchDetail,
      selectedItem,
      loadingDetail,
      setSelectedItem,
    },
  } = useStore()

  useEffect(() => {
    fetchDetail()

    return () => {
      setSelectedItem(null)
    }
  }, [fetchDetail, setSelectedItem])

  return (
    <>
      <div className="card bg-white border-round-xl px-4 py-3 py-5">
        {loadingDetail ? (
          <div className="w-full h-full flex justify-content-center align-items-center">
            <ProgressSpinner />
          </div>
        ) : selectedItem ? (
          <>
            <div className="flex align-items-center gap-4">
              <h1 className="text-3xl text-primary text-2xl font-bold m-0">
                {t('Headquarter')}
              </h1>
              {getUserStatusTag(selectedItem.status)}
            </div>
            <Divider />

            <FieldDetail
              label={t('Email')}
              value={selectedItem.email}
              hiddenWhenEmpty={false}
            ></FieldDetail>
            {/* <FieldDetail
              label={t('Name')}
              hiddenWhenEmpty={false}
              value={selectedItem.fullName}
            ></FieldDetail> */}
            <FieldDetail
              label={t('Address')}
              hiddenWhenEmpty={false}
              value={selectedItem.address}
            ></FieldDetail>
            <FieldDetail
              label={t('Phone Number')}
              hiddenWhenEmpty={false}
              value={formatPhone(selectedItem.phoneNumber)}
            ></FieldDetail>

            <FieldDetail
              label={t('Note')}
              hiddenWhenEmpty={false}
              value={selectedItem.note}
            ></FieldDetail>
            <Divider />
            <Link to={`/headquarter-information/edit`} className="w-fit">
              <Button label={t('Go To Edit')}></Button>
            </Link>
          </>
        ) : (
          <Empty />
        )}
      </div>
      {selectedItem ? (
        <>
          <DonutCharts />
          {selectedItem.event.byMonth?.length ? <EventChart /> : null}

          {selectedItem.customer.byMonth?.length ? <CustomerChart /> : null}
          {selectedItem.branchInformation?.meta?.total ? <TopBranch /> : null}
        </>
      ) : null}
    </>
  )
}

export default observer(HeadQuarterInformation)

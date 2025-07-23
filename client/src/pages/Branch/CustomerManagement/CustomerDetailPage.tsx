import Empty from 'components/Empty'
import FieldDetail from 'components/FieldDetail'
import { useStore } from 'context/store'
import { observer } from 'mobx-react'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'
import { Dialog } from 'primereact/dialog'
import { Divider } from 'primereact/divider'
import { ProgressSpinner } from 'primereact/progressspinner'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { CustomerStatusEnum } from 'utils/constants/customer'
// import { formatPhone } from 'utils/helper/common-helpers'
import { getCustomerStatusTag } from 'utils/helper/table'

const CustomerDetailPage = () => {
  const { t } = useTranslation()
  const {
    custormerManagementStore: {
      fetchDetail,
      selectedItem,
      loadingDetail,
      setSelectedItem,
      block,

      loadingSubmit,
    },
  } = useStore()

  const { id } = useParams()
  useEffect(() => {
    if (id) fetchDetail(id)

    return () => {
      setSelectedItem(null)
    }
  }, [fetchDetail, id, setSelectedItem])
  const [showModalHistory, setShowModalHistory] = useState(false)

  return (
    <div className="card bg-white border-round-xl px-4 py-3 py-5">
      {loadingDetail ? (
        <div className="w-full h-full flex justify-content-center align-items-center">
          <ProgressSpinner />
        </div>
      ) : selectedItem ? (
        <>
          <Dialog
            onHide={() => {
              setShowModalHistory(false)
            }}
            header={t('Registed History')}
            visible={showModalHistory}
            style={{ width: '80vw', height: '70vh' }}
          ></Dialog>

          <div className="flex align-items-center gap-4 flex-1">
            <h1 className="text-3xl text-2xl font-bold m-0 ">
              {t('Customer details')}
            </h1>
            {getCustomerStatusTag(selectedItem.status)}
          </div>

          <Divider />

          <FieldDetail
            label={t('Name')}
            value={selectedItem.name}
          ></FieldDetail>
          <FieldDetail
            label={t('Furigana')}
            value={selectedItem.furigana}
          ></FieldDetail>
          <FieldDetail
            label={t('Email')}
            value={selectedItem.email}
          ></FieldDetail>
          {/* <FieldDetail
            label={t('Phone number')}
            value={formatPhone(selectedItem.phoneNumber)}
          ></FieldDetail> */}
          <FieldDetail
            label={t('Registed History')}
            hiddenWhenEmpty={false}
            value={
              <ul
                className=" my-0"
                style={{
                  paddingLeft: '18px',
                }}
              >
                <li>
                  {t('Registed')}:{' '}
                  {selectedItem?.registeredHistory.registeredNumber}
                </li>
                <li>
                  {t('Canceled')}:{' '}
                  {selectedItem?.registeredHistory.canceledNumber}
                </li>
              </ul>
            }
            btnExpand={
              <div
                className="text-blue-500 cursor-pointer font-normal"
                onClick={() => setShowModalHistory(true)}
              >
                ({t('View')})
              </div>
            }
          />
          <FieldDetail
            label={t('About this Customer')}
            value={selectedItem.note}
          ></FieldDetail>
          <Divider />

          <div className="flex justify-content-between w-full">
            {selectedItem.status === CustomerStatusEnum.Active ? (
              <Link to={`edit`}>
                <Button label={t('Edit')}></Button>
              </Link>
            ) : (
              <div />
            )}

            <div className="flex gap-4">
              {selectedItem.status === CustomerStatusEnum.Active ? (
                <Button
                  label={t('Block')}
                  className="uppercase"
                  severity="secondary"
                  loading={loadingSubmit}
                  onClick={() => {
                    confirmDialog({
                      message: t('doyouwant', {
                        action: t('block this user'),
                      }),
                      header: t('confirmation', {
                        action: t('Block'),
                      }),
                      acceptLabel: t('Yes'),
                      rejectLabel: t('No'),
                      accept: () => block(selectedItem._id, true),
                    })
                  }}
                />
              ) : (
                <Button
                  label={t('Unblock')}
                  className="uppercase"
                  loading={loadingSubmit}
                  onClick={() => {
                    confirmDialog({
                      message: t('doyouwant', {
                        action: t('unblock this user'),
                      }),
                      header: t('confirmation', {
                        action: t('Unblock'),
                      }),
                      acceptLabel: t('Yes'),
                      rejectLabel: t('No'),
                      accept: () => block(selectedItem._id, false),
                    })
                  }}
                />
              )}
            </div>
          </div>
        </>
      ) : (
        <Empty />
      )}
    </div>
  )
}

export default observer(CustomerDetailPage)

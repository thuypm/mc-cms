import Empty from 'components/Empty'
import FieldDetail from 'components/FieldDetail'
import { useStore } from 'context/store'
import { observer } from 'mobx-react'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'
import { Divider } from 'primereact/divider'
import { ProgressSpinner } from 'primereact/progressspinner'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { BranchStatusEnum } from 'utils/constants/branch'
import { formatPhone } from 'utils/helper/common-helpers'
import { getBranchStatusTag } from 'utils/helper/table'

const BranchDetailPage = () => {
  const { t } = useTranslation()
  const {
    branchManagementStore: {
      fetchDetail,
      selectedItem,
      loadingDetail,
      loadingSubmit,
      activate,
      setSelectedItem,
    },
  } = useStore()

  const { id } = useParams()

  useEffect(() => {
    if (id) fetchDetail(id)
    return () => {
      setSelectedItem(null)
    }
  }, [fetchDetail, id, setSelectedItem])

  const onChangeBrachStatus = async (status) => {
    await activate(id, status === BranchStatusEnum.Active)
  }

  return (
    <div className="card bg-white border-round-xl px-4 py-3 py-5">
      {loadingDetail ? (
        <div className="w-full h-full flex justify-content-center align-items-center">
          <ProgressSpinner />
        </div>
      ) : selectedItem ? (
        <>
          <div className="flex align-items-center gap-4 ">
            <h1 className="text-3xl text-primary  font-bold m-0">
              {selectedItem.name}
            </h1>
            {getBranchStatusTag(selectedItem.status)}
          </div>
          <Divider />

          <FieldDetail
            label={t('Email')}
            value={selectedItem.email}
          ></FieldDetail>
          <FieldDetail
            label={t('Address')}
            value={selectedItem.address}
          ></FieldDetail>
          <FieldDetail
            label={t('Phone Number')}
            value={formatPhone(selectedItem.phoneNumber)}
          ></FieldDetail>
          <FieldDetail
            label={t('Person in charged')}
            value={selectedItem.personInCharged}
          ></FieldDetail>
          <FieldDetail
            label={t('Note')}
            value={selectedItem.note}
          ></FieldDetail>
          <Divider />

          <div className="flex justify-content-between">
            <Link to={`/branch-management/${selectedItem._id}/edit`}>
              <Button label={t('Go To Edit')}></Button>
            </Link>
            {selectedItem.status === BranchStatusEnum.Active ? (
              <Button
                label={t('Deactive')}
                className="uppercase p-button-inactive"
                loading={loadingSubmit}
                onClick={() => {
                  confirmDialog({
                    message: t('doyouwant', {
                      action: t('Deactive', { item: t('Branch') }),
                    }),
                    header: t('confirmation', {
                      action: t('Deactive'),
                    }),
                    acceptLabel: t('Yes'),
                    rejectLabel: t('No'),
                    accept: () =>
                      onChangeBrachStatus(BranchStatusEnum.Inactive),
                  })
                }}
              ></Button>
            ) : selectedItem.status === BranchStatusEnum.Inactive ? (
              <Button
                label={t('Active')}
                className="uppercase"
                severity="success"
                loading={loadingSubmit}
                onClick={() => {
                  confirmDialog({
                    message: t('doyouwant', {
                      action: t('Active', { item: t('Branch') }),
                    }),

                    header: t('confirmation', {
                      action: t('Active'),
                    }),
                    acceptLabel: t('Yes'),
                    rejectLabel: t('No'),
                    accept: () => onChangeBrachStatus(BranchStatusEnum.Active),
                  })
                }}
              ></Button>
            ) : null}
          </div>
        </>
      ) : (
        <Empty />
      )}
    </div>
  )
}

export default observer(BranchDetailPage)

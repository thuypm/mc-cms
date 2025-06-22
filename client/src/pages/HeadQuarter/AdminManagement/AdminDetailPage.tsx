import Empty from 'components/Empty'
import FieldDetail from 'components/FieldDetail'
import { useStore } from 'context/store'
import dayjs from 'dayjs'
import { observer } from 'mobx-react'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'
import { Divider } from 'primereact/divider'
import { ProgressSpinner } from 'primereact/progressspinner'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { DATE_TIME_FORMAT } from 'utils/constants/datetime'
import { UserStatusEnum } from 'utils/constants/user'
import { checkNullDeleteItem, formatPhone } from 'utils/helper/common-helpers'
import { getUserStatusTag } from 'utils/helper/table'

const EventManagement = () => {
  const { t } = useTranslation()
  const {
    adminManagementStore: {
      fetchDetail,
      selectedItem,
      loadingDetail,
      setSelectedItem,
      activate,
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

  const onChangeUserStatus = async (status) => {
    await activate(id, status === UserStatusEnum.Active)
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
              {selectedItem.fullName}
            </h1>
            {getUserStatusTag(selectedItem.status)}
          </div>
          <Divider />

          <FieldDetail
            label={t('Branch')}
            value={
              selectedItem.branch
                ? checkNullDeleteItem(selectedItem.branch, 'name', t('Branch'))
                : t('Headquarter')
            }
          ></FieldDetail>
          <FieldDetail
            label={t('Name')}
            value={selectedItem.fullName}
          ></FieldDetail>
          <FieldDetail
            label={t('Email')}
            value={selectedItem.email}
          ></FieldDetail>

          <FieldDetail
            label={t('Phone Number')}
            value={formatPhone(selectedItem.phoneNumber)}
          ></FieldDetail>
          <FieldDetail
            label={t('Created by')}
            value={checkNullDeleteItem(
              selectedItem?.createdBy,
              'fullName',
              t('Admin')
            )}
          ></FieldDetail>
          <FieldDetail
            label={t('Created time')}
            value={dayjs(selectedItem.createdAt).format(DATE_TIME_FORMAT.FULL)}
          ></FieldDetail>
          <FieldDetail
            label={t('Note')}
            value={selectedItem.note}
          ></FieldDetail>
          <Divider />

          <div className="flex justify-content-between w-full">
            <Link to={`/admin-management/${selectedItem._id}/edit`}>
              <Button label={t('Go To Edit')}></Button>
            </Link>
            <div className="flex gap-4">
              {/* <Button label={t('Reset Account')} severity="info"></Button> */}
              {selectedItem.status === UserStatusEnum.Active ? (
                <Button
                  label={t('Deactive')}
                  className="uppercase p-button-inactive"
                  loading={loadingSubmit}
                  onClick={() => {
                    confirmDialog({
                      message: t('doyouwant', {
                        action: t('Deactive', { item: t('Admin') }),
                      }),
                      header: t('confirmation', {
                        action: t('Deactive'),
                      }),
                      acceptLabel: t('Yes'),
                      rejectLabel: t('No'),
                      accept: () => onChangeUserStatus(UserStatusEnum.Inactive),
                    })
                  }}
                ></Button>
              ) : selectedItem.status === UserStatusEnum.Inactive ? (
                <Button
                  label={t('Active')}
                  className="uppercase"
                  severity="success"
                  loading={loadingSubmit}
                  onClick={() => {
                    confirmDialog({
                      message: t('doyouwant', {
                        action: t('Active', { item: t('Admin') }),
                      }),
                      header: t('confirmation', {
                        action: t('Active'),
                      }),
                      acceptLabel: t('Yes'),
                      rejectLabel: t('No'),
                      accept: () => onChangeUserStatus(UserStatusEnum.Active),
                    })
                  }}
                ></Button>
              ) : selectedItem.status === UserStatusEnum.Blocked ? (
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
                      accept: () => onChangeUserStatus(UserStatusEnum.Active),
                    })
                  }}
                ></Button>
              ) : null}
            </div>
          </div>
        </>
      ) : (
        <Empty />
      )}
    </div>
  )
}

export default observer(EventManagement)

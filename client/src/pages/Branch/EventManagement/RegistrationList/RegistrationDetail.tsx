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
import { formatPhone } from 'utils/helper/common-helpers'
import { getRegistrationStatusTag } from 'utils/helper/table'
import RegisteredHistory from './RegisterHistory'
import { CustomerStatusEnum } from 'utils/constants/customer'
import ModalResendMail from './ModalResendMail'
import { DATE_TIME_FORMAT } from 'utils/constants/datetime'
import dayjs from 'dayjs'

const RegistrationDetail = () => {
  const { t } = useTranslation()
  const {
    eventRegistrationStore: {
      fetchDetail,
      selectedItem,
      loadingDetail,
      setSelectedItem,
      loadingSubmit,
      block,
    },
  } = useStore()

  const { registrationId } = useParams()
  useEffect(() => {
    if (registrationId) fetchDetail(registrationId)

    return () => {
      setSelectedItem(null)
    }
  }, [fetchDetail, registrationId, setSelectedItem])

  return (
    <div className="card bg-white border-round-xl px-4 py-3 py-5">
      {loadingDetail ? (
        <div className="w-full h-full flex justify-content-center align-items-center">
          <ProgressSpinner />
        </div>
      ) : selectedItem ? (
        <>
          <div className="flex align-items-center gap-4 mb-4">
            <h1 className="text-3xl text-primary  font-bold m-0">
              {t('Registrations details')}
            </h1>
            {getRegistrationStatusTag(selectedItem.status)}
          </div>
          <Divider />

          <FieldDetail label={t('Name')} value={selectedItem.name} />
          <FieldDetail label={t('Furigana')} value={selectedItem.furigana} />
          <FieldDetail label={t('Email')} value={selectedItem.email} />
          <FieldDetail
            label={t('Phone Number')}
            value={formatPhone(selectedItem.phoneNumber)}
          />

          <Divider />
          <FieldDetail
            label={t('Registering event')}
            value={selectedItem.event.title}
          />
          <FieldDetail
            label={t('Time slot')}
            value={`${dayjs(selectedItem.timeslot?.startTime).format(DATE_TIME_FORMAT.HOUR)}-${dayjs(selectedItem.timeslot?.endTime).format(DATE_TIME_FORMAT.HOUR)}`}
          />
          <FieldDetail
            label={t('Registed Time')}
            value={dayjs(selectedItem.createdAt).format(
              DATE_TIME_FORMAT.FULL_SECOND
            )}
          />
          <FieldDetail label={t('Guest')} value={selectedItem.guest} />
          <FieldDetail label={t('Note')} value={selectedItem.note} />

          <Divider />

          <RegisteredHistory />
          <FieldDetail
            label={t('About this Customer')}
            value={selectedItem.customer?.note}
          />
          <Divider />

          <div className="flex justify-content-between w-full">
            {selectedItem.customer.status === CustomerStatusEnum.Blocked ? (
              <div />
            ) : (
              <div className="flex gap-4">
                <Link to={`edit`} className="h-full">
                  <Button label={t('Go To Edit')} className="h-full"></Button>
                </Link>

                <ModalResendMail registrationId={registrationId} />
              </div>
            )}

            <div className="flex gap-4 ">
              {selectedItem.customer.status === CustomerStatusEnum.Active ? (
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
                      accept: async () => {
                        try {
                          await block(selectedItem.customer._id, true)
                          await fetchDetail(registrationId)
                        } catch (error) {}
                      },
                      // accept: () => onChangeUserStatus(UserStatusEnum.Active),
                    })
                  }}
                ></Button>
              ) : (
                <Button
                  label={t('Unblock')}
                  className="uppercase"
                  outlined
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
                      accept: async () => {
                        try {
                          await block(selectedItem.customer._id, false)
                          await fetchDetail(registrationId)
                        } catch (error) {}
                      },
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

export default observer(RegistrationDetail)

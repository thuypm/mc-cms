import clsx from 'clsx'
import Empty from 'components/Empty'
import FieldDetail from 'components/FieldDetail'
import { useStore } from 'context/store'
import dayjs from 'dayjs'
import { observer } from 'mobx-react'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'
import { Divider } from 'primereact/divider'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { DATE_TIME_FORMAT } from 'utils/constants/datetime'
import { EventStatusEnum } from 'utils/constants/event'
import { getEventStatusTag } from 'utils/helper/table'
import ModalCancelEvent from './ModalCancelEvent'

const EventDetailPage = () => {
  const { t } = useTranslation()
  const {
    eventManamentStore: {
      fetchDetail,
      selectedItem,
      loadingDetail,
      setSelectedItem,
      sendInvite,

      deleteItem,

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

  const navigate = useNavigate()
  return (
    <div className="card bg-white border-round-xl px-4 py-3 py-5">
      {loadingDetail ? (
        <div className="w-full h-full flex justify-content-center align-items-center">
          <ProgressSpinner />
        </div>
      ) : selectedItem ? (
        <>
          <div className="flex justify-content-between gap-2 align-items-center  mb-4">
            <div className="flex align-items-center gap-4 flex-1">
              <h1 className="text-3xl text-primary text-2xl font-bold m-0 ">
                {selectedItem.title}
              </h1>
              {getEventStatusTag(selectedItem.status)}
            </div>

            <Link
              to={`registration`}
              className="bg-orange-500 border-round text-white h-min py-2 px-3 flex align-items-center"
            >
              <i className="isax-note-text mr-1"></i>(
              {selectedItem.registeredQuantityEvent}/
              {selectedItem.maxRegistrationsEvent}) {t('Registrations')}
            </Link>
          </div>{' '}
          <Divider />
          <h2 className="text-xl font-bold">{t('Event Information')}</h2>
          <FieldDetail
            label={t('Event Location')}
            value={selectedItem.location}
          ></FieldDetail>
          <FieldDetail
            label={t('Event Time')}
            value={
              <>
                <div className="mb-4">
                  {dayjs(selectedItem.startTimeEvent).format(
                    DATE_TIME_FORMAT.DAY_ONLY
                  )}
                </div>
                <div className="flex-wrap flex gap-4">
                  {selectedItem.timeslots.map((slot) => (
                    <div
                      className="flex w-20rem gap-7 align-items-center justify-content-between px-5 py-2 border-1 border-solid border-gray-300 w-fit border-round"
                      key={slot._id}
                    >
                      <div>
                        {dayjs(
                          new Date(new Date(slot.startTime).getTime())
                        ).format(DATE_TIME_FORMAT.HOUR)}
                        ~
                        {dayjs(
                          new Date(new Date(slot.endTime).getTime())
                        ).format(DATE_TIME_FORMAT.HOUR)}
                      </div>

                      <div className="text-yellow-700 text-sm">
                        {slot.maxRegistrations} {t('People')}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            }
          ></FieldDetail>
          <FieldDetail
            label={t('Registration Before')}
            value={dayjs(selectedItem.receptionBefore).format(
              DATE_TIME_FORMAT.FULL
            )}
          ></FieldDetail>
          <FieldDetail
            label={t('Cancel Before')}
            value={dayjs(selectedItem.cancelBefore).format(
              DATE_TIME_FORMAT.FULL
            )}
          ></FieldDetail>
          <FieldDetail
            label={t('Remind before')}
            value={selectedItem.remindBefore + 'h'}
          ></FieldDetail>
          <FieldDetail
            label={t('Applications Unit')}
            value={t(selectedItem.applicationUnit)}
          ></FieldDetail>
          <FieldDetail
            label={t('Event Description')}
            value={
              <div
                className="ql-editor p-0"
                dangerouslySetInnerHTML={{
                  __html: selectedItem.description,
                }}
              ></div>
            }
          ></FieldDetail>
          <div className={clsx(' gap-4 w-full', 'mb-3')}>
            <div className="text-gray-900 font-medium flex align-items-end gap-2">
              {t('Event invitation email’s Note')}
              <p className="text-red-500 m-0 text-xs">
                {t('This note will only use in Event invitation email.')}
              </p>
            </div>
            <div
              className="flex-1 mt-2 "
              style={{ paddingLeft: '13.5rem', whiteSpace: 'pre-wrap' }}
            >
              {selectedItem.note}
            </div>
          </div>
          {selectedItem?.questions?.length ? (
            <>
              <Divider className="border-dashed-divider" />

              <h2 className="text-xl font-bold">{t('Question')}</h2>
              {selectedItem?.questions?.map((item, index) => (
                <Fragment key={index}>
                  <FieldDetail
                    className="mb-1"
                    label={t('Question') + ' ' + (index + 1)}
                    value={item.question}
                  ></FieldDetail>
                  <FieldDetail
                    label={t('Answer') + ' ' + (index + 1)}
                    value={item.answer}
                  ></FieldDetail>
                </Fragment>
              ))}
            </>
          ) : null}
          <Divider />
          <div className="flex justify-content-between w-full">
            {selectedItem.status === EventStatusEnum.Open ? (
              <Link to={`/event-management/${selectedItem._id}/edit`}>
                <Button label={t('Edit')}></Button>
              </Link>
            ) : (
              <div></div>
            )}

            <div className="flex gap-4">
              <ModalCancelEvent />
              {selectedItem.status === EventStatusEnum.Finished ||
              selectedItem.status === EventStatusEnum.Canceled ? (
                <Button
                  label={t('Delete')}
                  outlined
                  severity="secondary"
                  loading={loadingSubmit}
                  onClick={() => {
                    confirmDialog({
                      message: t('doyouwant', {
                        action: t('Delete', { item: t('Event') }),
                      }),
                      header: t('confirmation', {
                        action: t('Delete'),
                      }),
                      acceptLabel: t('Yes'),
                      rejectLabel: t('No'),
                      accept: async () => {
                        try {
                          await deleteItem(id)
                          navigate('/event-management')
                        } catch (error) {}
                      },
                    })
                  }}
                ></Button>
              ) : null}
              {selectedItem.status === EventStatusEnum.Open ? (
                <Button
                  label={t('Send invite')}
                  outlined
                  type="button"
                  onClick={() => {
                    confirmDialog({
                      message: (
                        <div>
                          {t(
                            'You will send invitation to all customers of the branch'
                          )}
                          <p className="text-sm">
                            {' '}
                            {t('This is your number email', {
                              number: selectedItem.sendMailInviteTimes + 1,
                            })}
                          </p>
                        </div>
                      ),
                      header: t('confirmation', {
                        action: t('Send invite Email'),
                      }),
                      acceptLabel: t('Yes'),
                      rejectLabel: t('No'),
                      accept: async () => {
                        await sendInvite(id)
                      },
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

export default observer(EventDetailPage)

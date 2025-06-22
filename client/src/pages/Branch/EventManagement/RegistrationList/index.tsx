import BaseManagementComponent from 'components/BaseManagementComponent'
import FilterSelect from 'components/InfiniteSelect/FilterSelect'
import InputSearchKeyword from 'components/InputSearchKeyword'
import { useStore } from 'context/store'
import dayjs from 'dayjs'
import { observer } from 'mobx-react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'
import { Tag } from 'primereact/tag'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { DATE_TIME_FORMAT } from 'utils/constants/datetime'
import { RegistrationStatusEnum } from 'utils/constants/event'
import { getRegistrationStatusTag } from 'utils/helper/table'
import { useObjectSearchParams } from 'utils/hooks/useObjectSearchParams'
import PrintPdf from './PrintPdf'
import { formatPhone } from 'utils/helper/common-helpers'

const RegistrationList = () => {
  const { t } = useTranslation()
  const {
    eventRegistrationStore: {
      loadingListing,
      handleFilterDataChange,
      filterData,
      currentEvent,
      loadingDetail,
      listData: { data, meta },
      exportListRegistration,
      setContextId,
      contextId,
    },
  } = useStore()

  const { id } = useParams()
  useEffect(() => {
    setContextId(id)
    return () => {
      setContextId(null)
    }
  }, [id, setContextId])
  const [showPrint, setShowPrint] = useState(false)

  const { setRestSearchObject, searchObject } = useObjectSearchParams()

  return contextId ? (
    <BaseManagementComponent
      dataSource={data}
      loading={loadingListing}
      actionColumns={[
        {
          key: 'view',
          icon: <i className="isax-eye"></i>,
          href: (item) => `${item._id}`,
          tooltip: t('View'),
        },
      ]}
      columns={[
        {
          key: 'name',
          dataIndex: 'name',
          header: t('Name'),
          width: '15%',
        },
        {
          key: 'furigana',
          header: t('Furigana'),
          sortable: true,
          width: '15%',
        },
        {
          key: 'email',
          header: t('Email'),
          width: '24%',
        },
        {
          key: 'phoneNumber',
          header: t('Phone number'),
          body: (data) => formatPhone(data.phoneNumber),
          width: '140px',
        },
        {
          key: 'registedTime',
          header: t('時間枠'),
          sortable: true,
          body: (data) =>
            `${dayjs(data.timeslot?.startTime).format(DATE_TIME_FORMAT.HOUR)}-${dayjs(data.timeslot?.endTime).format(DATE_TIME_FORMAT.HOUR)}`,
          width: '10%',
        },
        {
          key: 'guest',
          header: t('Guest'),
          width: '10%',
        },
        {
          key: 'status',
          filter: true,

          filterElement: (options) => {
            return (
              <FilterSelect
                options={Object.values(RegistrationStatusEnum).map((e) => ({
                  label: t(e),
                  value: e,
                }))}
                className="w-20rem"
                onSelectItem={(_, value) => {
                  options.filterCallback(value, options.index)
                }}
                showSearch={false}
                multiple={true}
                value={options.value}
                onChange={(e) => options.filterApplyCallback(e, options.index)}
                placeholder={t('Select One')}
              />
            )
          },
          showFilterMatchModes: false,
          filterField: 'status',
          filterMatchMode: 'contains',
          body: (item) => getRegistrationStatusTag(item.status),
          header: t('Status'),
          width: '100px',
        },
      ]}
      actionWidth={'8%'}
      pagination={{
        ...meta,
      }}
      handleFilterDataChange={handleFilterDataChange}
      filterComponent={
        <>
          <Dialog
            onHide={() => {
              setShowPrint(false)
            }}
            visible={showPrint}
            style={{ width: '80vw', height: '70vh' }}
          >
            <PrintPdf
              filterData={filterData}
              currentEvent={currentEvent}
              currentTimeSlot={currentEvent?.timeslots?.find(
                (e) => e._id === searchObject.timeslotId
              )}
            />
          </Dialog>
          <div className="flex justify-content-between align-items-center">
            <h1 className="text-3xl text-primary">{t('Registrations List')}</h1>

            <div className="flex gap-4">
              <InputSearchKeyword placeholder={t('Search')} />

              <Button
                icon="isax-direct-inbox"
                label={t('Download list')}
                loading={loadingDetail}
                outlined
                onClick={exportListRegistration}
              >
                &nbsp;
              </Button>

              <Button
                onClick={() => setShowPrint(true)}
                icon="isax-printer"
                outlined
                label={t('Print list')}
              >
                &nbsp;
              </Button>
            </div>
          </div>
          {currentEvent?.title ? (
            <>
              <h2 className="text-xl">
                {t('Event')}: {currentEvent?.title}
              </h2>
              <div className="flex justify-content-between flex-wrap gap-4">
                <div className="flex gap-4">
                  <div className="flex gap-2 align-items-center">
                    <Tag
                      className="px-4 text-base uppercase"
                      severity="warning"
                    >
                      {t('CNOR')}
                    </Tag>
                    <p className="m-0 font-medium">
                      {currentEvent?.registeredQuantityEvent ?? 0} /{' '}
                      {currentEvent.maxRegistrationsEvent ?? 0}
                    </p>
                  </div>
                  <div className="flex gap-2 align-items-center">
                    <Tag
                      className="px-4 text-base uppercase"
                      severity="success"
                    >
                      {t('Registed')}
                    </Tag>
                    <p className="m-0 font-medium">
                      {currentEvent?.registeredCount ?? 0}
                    </p>
                  </div>

                  <div className="flex gap-2 align-items-center">
                    <Tag className="p-tag-purpil uppercase px-4 text-base">
                      {t('Invalid mail')}
                    </Tag>
                    <p className="m-0 font-medium">
                      {currentEvent?.invalidMailCount ?? 0}
                    </p>
                  </div>
                  <div className="flex gap-2 align-items-center">
                    <Tag className="p-tag-inactive uppercase px-4 text-base">
                      {t('Canceled')}
                    </Tag>
                    <p className="m-0 font-medium">
                      {currentEvent?.canceledCount ?? 0}
                    </p>
                  </div>
                </div>
                <div>
                  <Dropdown
                    className="w-20rem"
                    placeholder={t('Select time slot')}
                    value={searchObject?.timeslotId}
                    onChange={(e) => {
                      setRestSearchObject({
                        timeslotId: e.target.value,
                      })
                    }}
                    showClear
                    options={[
                      ...currentEvent?.timeslots.map((item) => ({
                        value: item._id,
                        label: `${dayjs(item.startTime).format(DATE_TIME_FORMAT.FULL)} - ${dayjs(item.endTime).format(DATE_TIME_FORMAT.FULL)}`,
                      })),
                    ]}
                  />
                </div>
              </div>
            </>
          ) : null}
        </>
      }
    />
  ) : null
}
export default observer(RegistrationList)

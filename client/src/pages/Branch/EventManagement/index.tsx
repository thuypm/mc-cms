import clsx from 'clsx'
import BaseManagementComponent from 'components/BaseManagementComponent'
import FilterSelect from 'components/InfiniteSelect/FilterSelect'
import InputSearchKeyword from 'components/InputSearchKeyword'
import { useStore } from 'context/store'
import dayjs from 'dayjs'
import { observer } from 'mobx-react'
import { Button } from 'primereact/button'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { DATE_TIME_FORMAT } from 'utils/constants/datetime'
import { EventStatusEnum } from 'utils/constants/event'
import { getEventStatusTag } from 'utils/helper/table'

const EventManagement = () => {
  const { t } = useTranslation()
  const {
    eventManamentStore: {
      loadingListing,
      handleFilterDataChange,
      listData: { data, meta },
    },
  } = useStore()

  return (
    <BaseManagementComponent
      dataSource={data}
      loading={loadingListing}
      actionColumns={[
        {
          key: 'go_to_registraion',
          icon: <i className="isax-arrow-right-2"></i>,
          href: (item) => item.link,
          linkTarget: '_blank',
          tooltip: t('Go to booking site'),
        },
        {
          key: 'view',
          icon: <i className="isax-eye"></i>,
          href: (item) => `/event-management/${item._id}`,
          tooltip: t('View'),
        },
        {
          key: 'registration',
          icon: <i className="isax-people"></i>,
          href: (item) => `/event-management/${item._id}/registration`,
          tooltip: t('Registration list'),
        },
        {
          key: 'clone',
          icon: <i className="isax-copy"></i>,
          href: (item) => `/event-management/create?cloneId=${item._id}`,
          tooltip: t('Clone Event'),
        },
        // {
        //   key: 'delete',
        //   icon: <i className="isax-trash"></i>,
        //   showConfirm: {},
        //   action: (data) => {
        //     deleteItem(data._id)
        //   },
        //   tooltip: t('Delete'),
        // },
      ]}
      columns={[
        {
          key: 'title',
          dataIndex: 'title',
          header: t('Event name'),
        },
        {
          key: 'location',
          header: t('Location'),
          width: '20%',
        },

        {
          key: 'startTimeEvent',
          sortable: true,
          body: (data) =>
            dayjs(data.startTimeEvent).format(DATE_TIME_FORMAT.FULL),
          width: 200,

          header: t('Start Time'),
        },
        {
          key: 'maxRegistrations',
          header: t('Registration'),
          body: (data) => (
            <div
              className={clsx(
                data.registeredQuantityEvent === data.maxRegistrationsEvent
                  ? 'text-red-800'
                  : ''
              )}
            >
              {(data.registeredQuantityEvent ?? 0) +
                '/' +
                data.maxRegistrationsEvent}
            </div>
          ),
          width: 120,
        },
        {
          key: 'status',
          filter: true,

          filterElement: (options) => {
            return (
              <FilterSelect
                options={Object.values(EventStatusEnum).map((e) => ({
                  label: t(e),
                  value: e,
                }))}
                showSearch={false}
                className="w-20rem"
                multiple={false}
                value={options.value}
                onSelectItem={(_, value) => {
                  options.filterCallback(value, options.index)
                }}
                onChange={(e) => options.filterApplyCallback(e, options.index)}
                placeholder={t('Select One')}
              />
            )
          },
          showFilterMatchModes: false,
          filterField: 'status',
          filterMatchMode: 'contains',
          body: (item) => getEventStatusTag(item.status),
          header: t('Status'),
          width: 120,
        },
      ]}
      pagination={{
        ...meta,
      }}
      handleFilterDataChange={handleFilterDataChange}
      filterComponent={
        <div className="flex justify-content-between align-items-center">
          <h1 className="text-3xl">{t('Event List')}</h1>
          <div className="flex gap-4">
            <InputSearchKeyword placeholder={t('Search for Title, Location')} />
            <Link to={'create'}>
              <Button
                icon="isax isax-add"
                label={t('Add new', { item: t('Event') })}
              >
                &nbsp;
              </Button>
            </Link>
          </div>
        </div>
      }
    />
  )
}
export default observer(EventManagement)

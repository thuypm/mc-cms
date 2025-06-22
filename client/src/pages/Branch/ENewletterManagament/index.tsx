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
import { EnewLetterStatusEnum } from 'utils/constants/enewletter'
import { checkNullDeleteItem } from 'utils/helper/common-helpers'
import { getEnewLetterStatusTag } from 'utils/helper/table'

const ENewletterManagament = () => {
  const { t } = useTranslation()
  const {
    enewLetterStore: {
      loadingListing,
      handleFilterDataChange,
      deleteItem,
      listData: { data, meta },
    },
  } = useStore()

  return (
    <BaseManagementComponent
      dataSource={data}
      loading={loadingListing}
      actionColumns={[
        {
          key: 'view',
          icon: <i className="isax-eye"></i>,
          href: (item) => `/enewletter-management/${item._id}`,
          tooltip: t('View'),
        },
        {
          key: 'clone',
          icon: <i className="isax-copy"></i>,
          href: (item) => `/enewletter-management/create?cloneId=${item._id}`,
          tooltip: t('Clone Enewletter'),
        },
        {
          key: 'delete',
          icon: <i className="isax-trash"></i>,
          showConfirm: {},
          action: (data) => {
            deleteItem(data._id)
          },
          tooltip: t('Delete'),
        },
      ]}
      columns={[
        {
          key: 'title',
          header: t('Title'),
          width: '50%',
        },
        {
          key: 'scheduledTime',
          header: t('Schedule Time'),
          sortable: true,
          body: (data) =>
            dayjs(data.scheduledTime).format(DATE_TIME_FORMAT.FULL),
          width: '20%',
        },
        {
          key: 'createdBy',
          header: t('Created by'),

          body: (data) =>
            checkNullDeleteItem(data.createdBy, 'fullName', t('Admin')),
          width: '20%',
        },
        {
          key: 'status',
          dataIndex: 'status',
          header: t('Status'),
          body: (item) => getEnewLetterStatusTag(item.status),
          filter: true,
          width: '100px',
          filterElement: (options) => {
            return (
              <FilterSelect
                options={Object.values(EnewLetterStatusEnum).map((key) => ({
                  label: t(key),
                  value: key,
                }))}
                className="w-20rem"
                multiple={false}
                value={options.value}
                onSelectItem={(_, value) => {
                  options.filterCallback(value, options.index)
                }}
                showSearch={false}
                onChange={(e) => options.filterApplyCallback(e, options.index)}
                placeholder={t('Select One')}
              />
            )
          },
          showFilterMatchModes: false,
          filterField: 'status',
          filterMatchMode: 'contains',
        },
      ]}
      pagination={{
        ...meta,
      }}
      handleFilterDataChange={handleFilterDataChange}
      filterComponent={
        <div className="flex justify-content-between align-items-center flex-wrap">
          <h1 className="text-3xl font-bold">{t('E-Newsletter List')}</h1>
          <div className="flex gap-3 flex-wrap">
            <InputSearchKeyword placeholder={t('Search for Title')} />

            <Link to={'create'}>
              <Button
                icon="isax isax-add"
                label={t('Add new', { item: t('E-Newsletter') })}
              ></Button>
            </Link>
          </div>
        </div>
      }
    />
  )
}
export default observer(ENewletterManagament)

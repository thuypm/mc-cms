import BaseManagementComponent from 'components/BaseManagementComponent'
import FilterSelect, {
  FilterSelectLazy,
} from 'components/InfiniteSelect/FilterSelect'
import { useStore } from 'context/store'
import { WorkspaceContext } from 'context/workspace.context'
import dayjs from 'dayjs'
import { observer } from 'mobx-react'
import { Button } from 'primereact/button'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { DATE_TIME_FORMAT } from 'utils/constants/datetime'
import { UserStatusEnum } from 'utils/constants/user'
import { checkNullDeleteItem } from 'utils/helper/common-helpers'
import { getUserStatusTag } from 'utils/helper/table'

const headquarterValue = 'headquarter'
const AdminManagement = () => {
  const {
    adminManagementStore: {
      loadingListing,
      handleFilterDataChange,
      listData: { data, meta },
      deleteItem,
    },
  } = useStore()

  const { user } = useContext(WorkspaceContext)

  const { t } = useTranslation()
  return (
    <BaseManagementComponent
      dataSource={data}
      loading={loadingListing}
      actionColumns={[
        {
          key: 'view',
          icon: <i className="isax-eye"></i>,
          href: (item) => `/admin-management/${item._id}`,
          tooltip: t('View'),
        },
        {
          key: 'delete',
          icon: <i className="isax-trash"></i>,
          showConfirm: {
            message: t('doyouwant', {
              action: t('Delete item', {
                item: t('Admin'),
              }),
            }),
            header: t('confirmation', {
              action: t('Delete'),
            }),
          },
          disabled(data) {
            return data?._id === user._id
          },
          tooltip: t('Delete'),

          action: (data) => {
            deleteItem(data._id)
          },
        },
      ]}
      columns={[
        {
          key: 'fullName',
          dataIndex: 'fullName',
          header: t('Name'),
          width: '20%',
        },
        {
          key: 'branch',
          dataIndex: 'branch',
          header: t('Branch'),
          filter: true,
          filterField: 'branchIds',
          filterMatchMode: 'custom',
          showFilterMatchModes: false,
          width: '20%',

          filterElement: (options) => {
            let currentValue = options.value
              ? Array.isArray(options.value)
                ? options.value
                : [options.value]
              : []

            return (
              <>
                <FilterSelectLazy
                  url={`api/v1/branches`}
                  tranformData={(items) =>
                    items.map((item) => ({
                      label: item.name,
                      value: item._id,
                    }))
                  }
                  className="w-30rem"
                  firstItems={[
                    {
                      value: headquarterValue,
                      label: t('Headquarter'),
                    },
                  ]}
                  multiple
                  value={currentValue}
                  onSelectItem={(_, value) => {
                    options.filterCallback(value, options.index)
                  }}
                  onChange={(value) => {
                    options.filterApplyCallback(value, options.index)
                  }}
                  placeholder={t('Select one')}
                />
              </>
            )
          },
          body: (item) =>
            item.branch
              ? checkNullDeleteItem(item.branch, 'name', t('Branch'))
              : t('Headquarter'),
        },
        {
          key: 'email',
          dataIndex: 'email',
          width: '20%',
          header: t('Email'),
        },

        {
          width: '20%',
          key: 'createdAt',
          sortable: true,
          header: t('Created At'),
          body: (data) => dayjs(data.createdAt).format(DATE_TIME_FORMAT.FULL),
        },
        {
          key: 'status',
          body: (item) => getUserStatusTag(item.status),
          width: '100px',
          header: t('Status'),
          filter: true,

          filterElement: (options) => {
            return (
              <FilterSelect
                options={Object.values(UserStatusEnum).map((e) => ({
                  label: t(e),
                  value: e,
                }))}
                showSearch={false}
                className="w-20rem"
                multiple={false}
                onSelectItem={(_, value) => {
                  options.filterCallback(value, options.index)
                }}
                value={options.value}
                onChange={(e) =>
                  options.filterApplyCallback(e?.[0], options.index)
                }
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
        <div className="flex justify-content-between align-items-center">
          <h1 className="text-3xl font-bold">{t('Administrator List')}</h1>
          <Link to={'create'}>
            <Button icon="isax isax-add" label={t('Invite New Admin')}>
              &nbsp;
            </Button>
          </Link>
        </div>
      }
    />
  )
}
export default observer(AdminManagement)

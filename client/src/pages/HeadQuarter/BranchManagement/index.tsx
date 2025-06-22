import BaseManagementComponent from 'components/BaseManagementComponent'
import FilterSelect from 'components/InfiniteSelect/FilterSelect'
import InputSearchKeyword from 'components/InputSearchKeyword'
import { useStore } from 'context/store'
import dayjs from 'dayjs'
import { observer } from 'mobx-react'
import { Button } from 'primereact/button'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { BranchStatusEnum } from 'utils/constants/branch'
import { DATE_TIME_FORMAT } from 'utils/constants/datetime'
import { REACT_APP_BRANCH_PAGE } from 'utils/constants/environment'
import { formatPhone } from 'utils/helper/common-helpers'
import { getBranchStatusTag } from 'utils/helper/table'

const BranchManagement = () => {
  const { t } = useTranslation()
  const {
    branchManagementStore: {
      handleFilterDataChange,
      loadingListing,
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
          tooltip: t('Go to branch page'),
          key: 'go_to_branch_page',
          icon: <i className="isax-programming-arrow"></i>,
          href: (item) => `${REACT_APP_BRANCH_PAGE}/${item._id}`,
          disabled: (item) => item.status === BranchStatusEnum.Inactive,
          linkTarget: '_blank',

          // tooltip: 'Go to branch page',
        },
        {
          key: 'view',
          tooltip: t('View'),

          icon: <i className="isax-eye"></i>,
          href: (item) => `/branch-management/${item._id}`,
        },
        {
          key: 'delete',
          tooltip: t('Delete'),

          icon: <i className="isax-trash"></i>,
          // href: (item) => `/branch-management/${item._id}/view`,
          showConfirm: {
            message: t('doyouwant', {
              action: t('Delete item', {
                item: t('Branch'),
              }),
            }),
            header: t('confirmation', {
              action: t('Delete'),
            }),
          },
          action: (data) => {
            deleteItem(data._id)
          },
        },
      ]}
      columns={[
        {
          key: 'name',
          header: t('Name'),
          width: '25%',
        },
        {
          key: 'address',
          header: t('Address'),
          width: '25%',
        },
        {
          key: 'phoneNumber',
          header: t('Phone number'),
          width: '15%',
          body: (data) => formatPhone(data.phoneNumber),
        },

        {
          key: 'createdAt',
          sortable: true,
          body: (data) => dayjs(data.createdAt).format(DATE_TIME_FORMAT.FULL),
          header: t('Created At'),
          width: '15%',
        },
        {
          key: 'status',
          body: (item) => getBranchStatusTag(item.status),
          header: t('Status'),
          width: '10%',
          filter: true,

          filterElement: (options) => {
            return (
              <FilterSelect
                options={Object.values(BranchStatusEnum).map((e) => ({
                  label: t(e),
                  value: e,
                }))}
                showSearch={false}
                className="w-20rem"
                onSelectItem={(_, value) => {
                  options.filterCallback(value, options.index)
                }}
                value={options.value}
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
        <div className="flex justify-content-between align-items-center">
          <h1 className="text-3xl">{t('Branch List')}</h1>
          <div className="flex gap-3 flex-wrap">
            <InputSearchKeyword placeholder={t('Search for Name, Address')} />
            <Link to={'create'}>
              <Button
                icon="isax isax-add"
                label={t('Add new', { item: t('Branch') })}
              ></Button>
            </Link>
          </div>
        </div>
      }
    />
  )
}
export default observer(BranchManagement)

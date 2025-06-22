import BaseManagementComponent from 'components/BaseManagementComponent'
import FilterSelect from 'components/InfiniteSelect/FilterSelect'
import InputSearchKeyword from 'components/InputSearchKeyword'
import { useStore } from 'context/store'
import { observer } from 'mobx-react'
import { Button } from 'primereact/button'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  CustomerRegistedByEnum,
  CustomerStatusEnum,
} from 'utils/constants/customer'
import { formatPhone } from 'utils/helper/common-helpers'
import { getCustomerStatusTag } from 'utils/helper/table'
import ExportCustomerList from './ExportCustomerList'
import GetInviteLink from './GetInviteLink'
import ModalImportData from './ModalImportData'

const CustomerManagement = () => {
  const { t } = useTranslation()
  const {
    custormerManagementStore: {
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
          href: (item) => `/customer-management/${item._id}`,
          tooltip: t('View'),
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
          key: 'name',
          dataIndex: 'name',
          header: t('Name'),
        },
        {
          key: 'furigana',
          dataIndex: 'furigana',
          header: t('Furigana'),
          sortable: true,
        },
        {
          key: 'email',
          dataIndex: 'email',
          header: t('Email'),
        },
        {
          key: 'phoneNumber',
          dataIndex: 'phoneNumber',
          header: t('Phone Number'),
          body: (item) => formatPhone(item.phoneNumber),
        },
        {
          key: 'registeredBy',
          dataIndex: 'registeredBy',
          header: t('Registed By'),
          body: (data) => t(data.registeredBy),

          filter: true,

          filterElement: (options) => {
            return (
              <FilterSelect
                options={Object.values(CustomerRegistedByEnum).map((key) => ({
                  label: t(key),
                  value: key,
                }))}
                className="w-20rem"
                multiple={false}
                showSearch={false}
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
          filterField: 'registeredBy',
          filterMatchMode: 'contains',
          width: 140,
        },
        {
          key: 'status',
          dataIndex: 'status',
          header: t('Customer Status'),
          body: (item) => getCustomerStatusTag(item.status),
          filter: true,
          width: 150,
          filterElement: (options) => {
            return (
              <FilterSelect
                options={Object.values(CustomerStatusEnum).map((key) => ({
                  label: t(key),
                  value: key,
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
        },
      ]}
      pagination={{
        ...meta,
      }}
      handleFilterDataChange={handleFilterDataChange}
      filterComponent={
        <div className="flex justify-content-between align-items-center flex-wrap">
          <h1 className="text-3xl font-bold">{t('Customer List')}</h1>
          <div className="flex gap-3 w-full">
            <InputSearchKeyword
              placeholder={t('Search for Name, Furigana, Email, Phone')}
            />
            <ExportCustomerList />
            <ModalImportData />

            <Link to={'create'}>
              <Button icon="isax isax-add" label={t('顧客登録')}></Button>
            </Link>
            <GetInviteLink />
          </div>
        </div>
      }
    />
  )
}
export default observer(CustomerManagement)

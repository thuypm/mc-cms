import BaseManagementComponent from 'components/BaseManagementComponent'
import InputSearchKeyword from 'components/InputSearchKeyword'
import { useStore } from 'context/store'
import { WorkspaceContext } from 'context/workspace.context'
import dayjs from 'dayjs'
import { observer } from 'mobx-react'
import { Button } from 'primereact/button'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { DATE_TIME_FORMAT } from 'utils/constants/datetime'
import { UserRoleEnum } from 'utils/constants/user'
import { checkNullDeleteItem } from 'utils/helper/common-helpers'

const ContactManagement = () => {
  const { t } = useTranslation()
  const {
    contactStore: {
      handleFilterDataChange,
      loadingListing,
      deleteItem,
      listData: { data, meta },
    },
  } = useStore()
  const { user } = useContext(WorkspaceContext)
  return (
    <BaseManagementComponent
      dataSource={data}
      loading={loadingListing}
      rowClassName={(data) => {
        return data.isRead ? '' : 'row-highlight'
      }}
      actionColumns={[
        {
          key: 'view',
          tooltip: t('View'),

          icon: <i className="isax-eye"></i>,
          href: (item) => `/contact-management/${item._id}`,
        },
        {
          key: 'delete',
          tooltip: t('Delete'),
          disabled: (item) => {
            return (
              user.role !== UserRoleEnum.Headquarter &&
              item.createdBy?._id !== user._id
            )
          },
          icon: <i className="isax-trash"></i>,
          // href: (item) => `/branch-management/${item._id}/view`,
          showConfirm: {
            message: t('doyouwant', {
              action: t('Delete item', {
                item: t('Thread'),
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
          key: 'createdBy',
          header: t('From'),
          width: '20%',
          body: (data) =>
            checkNullDeleteItem(data.createdBy, 'fullName', t('Admin')),
        },
        {
          key: 'title',
          header: t('Title'),
          width: '30%',
        },
        {
          key: 'lastUpdatedTime',
          sortable: true,
          body: (data) =>
            dayjs(data.lastUpdatedTime).format(DATE_TIME_FORMAT.FULL_SECOND),
          header: t('Last Updated At'),
          width: '20%',
        },
        {
          key: 'lastUpdater',
          header: t('Updater'),
          width: '20%',
          body: (data) =>
            checkNullDeleteItem(data.lastUpdater, 'fullName', t('Admin')),
        },
      ]}
      pagination={{
        ...meta,
      }}
      handleFilterDataChange={handleFilterDataChange}
      filterComponent={
        <div className="flex justify-content-between align-items-center">
          <h1 className="text-3xl">{t('Thread List')}</h1>
          <div className="flex gap-3 flex-wrap">
            <InputSearchKeyword placeholder={t('Search for From, Title')} />
            <Link to={'create'}>
              <Button
                icon="isax isax-add"
                label={t('Add new', { item: t('Thread') })}
              ></Button>
            </Link>
          </div>
        </div>
      }
    />
  )
}
export default observer(ContactManagement)

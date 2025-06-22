import BaseManagementComponent from 'components/BaseManagementComponent'
import { useStore } from 'context/store'
import { observer } from 'mobx-react'
import { useTranslation } from 'react-i18next'
import { contentWithoutHtml } from 'utils/constants/regex'

const EmailTemplate = () => {
  const { t } = useTranslation()
  const {
    emailTemplateStore: {
      loadingListing,
      handleFilterDataChange,
      listData: { data },
    },
  } = useStore()

  return (
    <BaseManagementComponent
      dataSource={data}
      loading={loadingListing}
      actionColumns={[
        {
          key: 'edit',
          icon: <i className="isax-edit"></i>,
          href: (item) => `/email-template/${item._id}/edit`,
          tooltip: t('Edit'),
        },
      ]}
      columns={[
        {
          key: 'type',
          dataIndex: 'type',
          header: t('Email Type'),
        },
        {
          key: 'title',
          dataIndex: 'title',
          header: t('Title'),
          width: '40%',
        },
        {
          key: 'content',
          dataIndex: 'content',
          header: t('Content'),
          width: '15%',
          body: (item) => contentWithoutHtml(item.content),
        },
      ]}
      pagination={null}
      handleFilterDataChange={handleFilterDataChange}
      filterComponent={
        <div className="flex justify-content-between align-items-center">
          <h1 className="text-3xl font-bold">{t('Email Template List')}</h1>
        </div>
      }
    />
  )
}
export default observer(EmailTemplate)

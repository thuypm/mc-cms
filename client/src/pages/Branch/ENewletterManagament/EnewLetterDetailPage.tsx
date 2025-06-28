import Tippy from '@tippyjs/react'
import Chip from 'components/Chip'
import Empty from 'components/Empty'
import FieldDetail from 'components/FieldDetail'
import { useStore } from 'context/store'
import { WorkspaceContext } from 'context/workspace.context'
import dayjs from 'dayjs'
import { observer } from 'mobx-react'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'
import { Divider } from 'primereact/divider'
import { ProgressSpinner } from 'primereact/progressspinner'
import { useContext, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { DATE_TIME_FORMAT } from 'utils/constants/datetime'
import { ScopeEnewLetter } from 'utils/constants/enewletter'
import { checkNullDeleteItem } from 'utils/helper/common-helpers'
import { getEnewLetterStatusTag } from 'utils/helper/table'

const EnewLetterDetailPage = () => {
  const { t } = useTranslation()
  const {
    enewLetterStore: {
      fetchDetail,
      selectedItem,
      loadingDetail,
      setSelectedItem,
      deleteItem,
    },
  } = useStore()
  const { user } = useContext(WorkspaceContext)
  const { id } = useParams()
  useEffect(() => {
    if (id) fetchDetail(id)

    return () => {
      setSelectedItem(null)
    }
  }, [fetchDetail, id, setSelectedItem])

  const navigate = useNavigate()

  const scopeSendingData = useMemo(() => {
    if (selectedItem) {
      if (selectedItem.sendTo === ScopeEnewLetter.Branch)
        return {
          label:
            !selectedItem.sendingBranches.length ||
            selectedItem.sendAllCustomers
              ? ''
              : t('Branch'),
          value:
            !selectedItem.sendingBranches.length ||
            selectedItem.sendAllCustomers
              ? t('All Branch Customer')
              : selectedItem.sendingBranches?.map((item) => (
                  <Tippy
                    content={checkNullDeleteItem(item, 'name', t('Branch'))}
                    key={item._id}
                  >
                    <Chip
                      children={checkNullDeleteItem(item, 'name', t('Branch'))}
                      key={item._id}
                    />
                  </Tippy>
                )),
        }
      if (selectedItem.sendTo === ScopeEnewLetter.Event)
        return {
          label: selectedItem.sendAllEvents ? '' : t('Event'),
          value: selectedItem.sendAllEvents
            ? t(`All Event's Customer`)
            : selectedItem.sendingEvents?.map((item) => (
                <Tippy
                  content={checkNullDeleteItem(item, 'title', t('Event'))}
                  key={item._id}
                >
                  <Chip
                    children={checkNullDeleteItem(item, 'title', t('Event'))}
                    key={item._id}
                    style={{
                      maxWidth: '10rem',
                    }}
                    className=" white-space-nowrap text-overflow-ellipsis overflow-hidden"
                  />
                </Tippy>
              )),
        }
    }
  }, [selectedItem, t])
  return (
    <div className="card bg-white border-round-xl px-4 py-3 py-5">
      {loadingDetail ? (
        <div className="w-full h-full flex justify-content-center align-items-center">
          <ProgressSpinner />
        </div>
      ) : selectedItem ? (
        <>
          <div className="flex justify-content-between gap-2">
            <div className="flex align-items-center gap-4 mb- flex-1">
              <h1 className="text-3xl text-primary text-2xl font-bold m-0 ">
                {selectedItem.title}
              </h1>
              {getEnewLetterStatusTag(selectedItem.status)}
            </div>
          </div>
          <Divider />

          <div
            className="ql-editor p-0"
            dangerouslySetInnerHTML={{ __html: selectedItem.content }}
          ></div>

          <Divider className="border-dashed-divider" />
          <FieldDetail
            label={t('Created by')}
            hiddenWhenEmpty={false}
            value={checkNullDeleteItem(
              selectedItem.createdBy,
              'fullName',
              t('Admin')
            )}
          />
          <FieldDetail
            label={t('Scheduled Time')}
            hiddenWhenEmpty={false}
            value={dayjs(selectedItem.scheduledTime).format(
              DATE_TIME_FORMAT.FULL
            )}
          />
          <FieldDetail
            label={
              <>
                <p className="m-0">{t('Customer')}</p>

                {scopeSendingData?.label ? (
                  <p className="m-0 font-italic">({scopeSendingData?.label})</p>
                ) : null}
              </>
            }
            value={
              <div className="flex gap-2 flex-wrap">
                {scopeSendingData?.value}
              </div>
            }
          ></FieldDetail>
          <Divider />

          <div className="flex justify-content-between w-full">
            <Button
              severity="secondary"
              label={t('Delete')}
              onClick={() => {
                confirmDialog({
                  message: t('doyouwant', {
                    action: t('Delete item', { item: t('E-Newsletter') }),
                  }),
                  header: t('confirmation', {
                    action: t('Delete'),
                  }),
                  acceptLabel: t('Yes'),
                  rejectLabel: t('No'),
                  accept: async () => {
                    try {
                      await deleteItem(selectedItem._id)
                      navigate('/enewletter-management')
                    } catch (error) {}
                  },
                })
              }}
            ></Button>
          </div>
        </>
      ) : (
        <Empty />
      )}
    </div>
  )
}

export default observer(EnewLetterDetailPage)

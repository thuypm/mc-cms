import Empty from 'components/Empty'
import { useStore } from 'context/store'
import { observer } from 'mobx-react'
import { Button } from 'primereact/button'
import { Paginator } from 'primereact/paginator'
import { ProgressSpinner } from 'primereact/progressspinner'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { UserRoleEnum } from 'utils/constants/user'
import { useObjectSearchParams } from 'utils/hooks/useObjectSearchParams'
import MessageItem from './MessageItem'
import ModalReply from './ModalReply'
import { checkNullDeleteItem } from 'utils/helper/common-helpers'

const DetailContactPage = () => {
  const { t } = useTranslation()
  const {
    messageStore: {
      listData,
      loadingListing,
      contextId,
      currentThread,
      setContextId,
      handleFilterDataChange,
    },
    contactStore: { readThread },
  } = useStore()
  const { data } = listData
  const { id } = useParams()
  useEffect(() => {
    if (id) setContextId(id)
    return () => {
      setContextId(null)
    }
  }, [id, setContextId])

  useEffect(() => {
    if (currentThread && !currentThread?.isRead && contextId)
      readThread(contextId)
  }, [contextId, currentThread, readThread])

  const navigate = useNavigate()

  const { searchObject, setRestSearchObject } = useObjectSearchParams()
  useEffect(() => {
    if (searchObject && contextId)
      handleFilterDataChange && handleFilterDataChange(searchObject)
  }, [contextId, handleFilterDataChange, searchObject])

  return (
    <div className="card  border-round-xl pb-5">
      {loadingListing ? (
        <div className="w-full h-full flex justify-content-center align-items-center">
          <ProgressSpinner />
        </div>
      ) : data.length ? (
        <>
          <div className=" mb-4 ">
            <div className=" p-4 bg-white shadow-2 mb-4 border-round">
              <h1 className="text-3xl text-2xl font-bold m-0">
                {currentThread?.title}
              </h1>
              <div className="flex justify-content-between overflow-hidden w-full gap-4 align-items-end">
                <div className="flex-1 overflow-hidden">
                  <div className="mt-4 white-space-nowrap overflow-hidden text-overflow-ellipsis ">
                    {t('From')}:&nbsp;{' '}
                    {currentThread?.fromBranch
                      ? checkNullDeleteItem(
                          currentThread.fromBranch,
                          'name',
                          t('Branch')
                        )
                      : t('Headquarter')}
                  </div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span className="mr-3">
                      {t('To')}
                      {': '}
                    </span>

                    {currentThread?.createdBy?.role ===
                      UserRoleEnum.Headquarter && !currentThread?.fromBranch ? (
                      (currentThread.branches as any) !== -1 ? (
                        currentThread.branches?.map((b) => (
                          <div
                            key={b._id}
                            style={{ maxWidth: 200 }}
                            className="white-space-nowrap text-overflow-ellipsis overflow-hidden bg-gray-100 px-2 border-1 border-gray-300 border-round"
                          >
                            {checkNullDeleteItem(b, 'name', t('Branch'))}
                          </div>
                        ))
                      ) : (
                        t('Item is deleted', { item: t('Branch') })
                      )
                    ) : (
                      <div className="white-space-nowrap text-overflow-ellipsis overflow-hidden w-full flex-1">
                        {t('Headquarter')}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 " style={{ flex: '0 0 auto' }}>
                  <Button
                    label={t('Back')}
                    className="h-fit"
                    onClick={() => navigate('/contact-management')}
                    severity="secondary"
                  />

                  <ModalReply />
                </div>
              </div>
            </div>

            {data?.map((item) => <MessageItem data={item} key={item._id} />)}
          </div>

          <Paginator
            first={(listData.meta?.page - 1) * listData.meta?.perPage}
            rows={listData.meta?.perPage}
            totalRecords={listData.meta?.total}
            template={{
              layout:
                'CurrentPageReport FirstPageLink PrevPageLink  PageLinks NextPageLink LastPageLink RowsPerPageDropdown',
              CurrentPageReport: (options) => {
                return (
                  <span>
                    {isNaN(options.first) ? 0 : options.first} -{' '}
                    {isNaN(options.last) ? 0 : options.last ?? 0} of{' '}
                    {options.totalRecords ?? 0}
                  </span>
                )
              },
            }}
            rowsPerPageOptions={[10, 20, 50]}
            onPageChange={(e) =>
              setRestSearchObject({
                page: e.page + 1,
                perPage: e.rows,
              })
            }
            className="justify-content-center"
          />
        </>
      ) : (
        <Empty />
      )}
    </div>
  )
}

export default observer(DetailContactPage)

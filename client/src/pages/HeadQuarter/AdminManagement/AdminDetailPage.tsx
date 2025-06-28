import Empty from 'components/Empty'
import FieldDetail from 'components/FieldDetail'
import { useStore } from 'context/store'
import { observer } from 'mobx-react'
import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import { ProgressSpinner } from 'primereact/progressspinner'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { UserStatusEnum } from 'utils/constants/user'
import { checkNullDeleteItem } from 'utils/helper/common-helpers'

const EventManagement = () => {
  const { t } = useTranslation()
  const {
    adminManagementStore: {
      fetchDetail,
      selectedItem,
      loadingDetail,
      setSelectedItem,
      activate,
      loadingSubmit,
    },
  } = useStore()

  const { id } = useParams()
  useEffect(() => {
    if (id) fetchDetail(id)

    return () => {
      setSelectedItem(null)
    }
  }, [fetchDetail, id, setSelectedItem])

  const onChangeUserStatus = async (status) => {
    await activate(id, status === UserStatusEnum.Active)
  }

  return (
    <div className="card bg-white border-round-xl px-4 py-3 py-5">
      {loadingDetail ? (
        <div className="w-full h-full flex justify-content-center align-items-center">
          <ProgressSpinner />
        </div>
      ) : selectedItem ? (
        <>
          {/* <div className="flex align-items-center gap-4 ">
            <h1 className="text-3xl text-primary  font-bold m-0">
              {selectedItem.fullName}
            </h1>
            {getUserStatusTag(selectedItem.status)}
          </div> */}
          <Divider />

          <FieldDetail
            label={t('Branch')}
            value={
              selectedItem.branch
                ? checkNullDeleteItem(selectedItem.branch, 'name', t('Branch'))
                : t('Headquarter')
            }
          ></FieldDetail>

          <Divider />

          <div className="flex justify-content-between w-full">
            <Link to={`/admin-management/${selectedItem._id}/edit`}>
              <Button label={t('Go To Edit')}></Button>
            </Link>
            <div className="flex gap-4"></div>
          </div>
        </>
      ) : (
        <Empty />
      )}
    </div>
  )
}

export default observer(EventManagement)

import AllInOneSelect from 'components/AllInOneSelect'
import BaseManagementComponent from 'components/BaseManagementComponent'
import InputSearchKeyword from 'components/InputSearchKeyword'
import { useStore } from 'context/store'
import { observer } from 'mobx-react'
import { REACT_APP_SERVER_API } from 'utils/constants/environment'
import { useObjectSearchParams } from 'utils/hooks/useObjectSearchParams'
import ModalImportData from './ModalImportData'

const StudentManagement = () => {
  const {
    studentManagementStore: {
      loadingListing,
      handleFilterDataChange,
      deleteItem,
      listData: { items, meta },
    },
  } = useStore()
  const { searchObject, setRestSearchObject } = useObjectSearchParams()

  return (
    <BaseManagementComponent
      dataSource={items}
      loading={loadingListing}
      actionColumns={[
        {
          key: 'view',
          icon: <i className="pi pi-eye"></i>,
          href: (item) => `/customer-management/${item._id}`,
          tooltip: 'Xem',
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
          key: 'avatar',
          dataIndex: 'avatar',
          header: 'Ảnh',
          body: (item) => (
            <img
              width={80}
              alt=""
              src={`${REACT_APP_SERVER_API}/images/${item.avatar}`}
            />
          ),
        },
        {
          key: 'name',
          dataIndex: 'name',
          header: 'Họ và tên',
        },
        {
          key: 'MCID',
          dataIndex: 'MCID',
          header: 'MCID',
        },
        {
          key: 'class',
          dataIndex: 'class.name',
          header: 'Lớp',
        },

        {
          key: 'dateOfBirth',
          dataIndex: 'dateOfBirth',
          header: 'NS',
        },
        {
          key: 'gender',
          dataIndex: 'gender',
          header: 'Giới tính',
        },
      ]}
      pagination={{
        ...meta,
      }}
      handleFilterDataChange={handleFilterDataChange}
      filterComponent={
        <div className="flex justify-content-between align-items-center flex-wrap">
          <h1 className="text-3xl font-bold">Danh sách học sinh</h1>
          <div className="flex gap-3 w-full">
            <InputSearchKeyword placeholder={'Tìm kiếm'} />
            <AllInOneSelect
              placeholder="Chọn lớp"
              className="w-15rem h-fit"
              url={'/api/student/get-all-class'}
              optionLabel="name"
              optionValue="_id"
              value={searchObject?.class}
              firstItems={[
                {
                  _id: null,
                  name: 'Tất cả lớp',
                },
              ]}
              onChange={function (value: any, selectedItem?: any): void {
                setRestSearchObject({
                  class: value?._id,
                })
              }}
            />
            <ModalImportData />
          </div>
        </div>
      }
    />
  )
}
export default observer(StudentManagement)

import BaseManagementComponent from 'components/BaseManagementComponent'
import FilterSelect from 'components/InfiniteSelect/FilterSelect'
import InputSearchKeyword from 'components/InputSearchKeyword'
import { useStore } from 'context/store'
import { observer } from 'mobx-react'
import { Button } from 'primereact/button'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
const dayHeaders = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
const DayBoarding = () => {
  const {
    dayBoardingStore: {
      loadingListing,
      handleFilterDataChange,
      deleteItem,
      listData: { data, meta },
    },
  } = useStore()
  const columnsWeekDay = useMemo(() => {
    return dayHeaders.map((day) => ({
      key: day,
      header: day, // hoặc giữ nguyên day nếu không cần dịch
    }))
  }, [])
  return (
    <BaseManagementComponent
      dataSource={data}
      loading={loadingListing}
      actionColumns={[
        {
          key: 'view',
          icon: <i className="isax-eye"></i>,
          href: (item) => `/enewletter-management/${item._id}`,
          tooltip: 'View',
        },
        {
          key: 'clone',
          icon: <i className="isax-copy"></i>,
          href: (item) => `/enewletter-management/create?cloneId=${item._id}`,
          tooltip: 'Clone Enewletter',
        },
        {
          key: 'delete',
          icon: <i className="isax-trash"></i>,
          showConfirm: {},
          action: (data) => {
            deleteItem(data._id)
          },
          tooltip: 'Delete',
        },
      ]}
      columns={[
        {
          key: 'ID',
          header: 'Mã HS',
        },
        {
          key: 'name',
          header: 'Họ và tên',
        },
        {
          key: 'class',
          header: 'Lớp',
        },
        ...columnsWeekDay,
        {
          key: 'status',
          dataIndex: 'status',
          header: 'Status',

          filter: true,
          width: '100px',
          filterElement: (options) => {
            return (
              <FilterSelect
                // options={Object.values(EnewLetterStatusEnum).map((key) => ({
                //   label: t(key),
                //   value: key,
                // }))}
                className="w-20rem"
                multiple={false}
                value={options.value}
                onSelectItem={(_, value) => {
                  options.filterCallback(value, options.index)
                }}
                showSearch={false}
                onChange={(e) => options.filterApplyCallback(e, options.index)}
                placeholder={'Select One'}
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
          <h1 className="text-xl font-bold">Đăng ký BT hàng ngày</h1>
          <div className="flex gap-3 flex-wrap">
            <InputSearchKeyword placeholder="Tìm kiếm" />
            <Button label={'Tạo dữ liệu'}></Button>
            <Link to={'create'}>
              <Button icon="isax isax-add" label={'Đăng ký dịch vụ'}></Button>
            </Link>
          </div>
        </div>
      }
    />
  )
}
export default observer(DayBoarding)

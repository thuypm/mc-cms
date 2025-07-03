import AllInOneSelect from 'components/AllInOneSelect'
import { useStore } from 'context/store'
import { WorkspaceContext } from 'context/workspace.context'
import { observer } from 'mobx-react'
import { Button } from 'primereact/button'
import { Checkbox } from 'primereact/checkbox'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Divider } from 'primereact/divider'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { MC_SERVICE } from 'utils/constants/common'
import { USER_POSITION } from 'utils/constants/user'

const CreateDayBoarding = () => {
  const { t } = useTranslation()

  const {
    dayBoardingStore: {
      fetchDetail,
      selectedItem,
      loadingDetail,
      loadingSubmit,
      setSelectedItem,
      update,
    },
  } = useStore()

  const navigate = useNavigate()

  const { user } = useContext(WorkspaceContext)
  const [selectedClass, setSelectedClass] = useState(null)

  useEffect(() => {
    if (selectedClass || user.position !== USER_POSITION.SUPER_ADMIN)
      fetchDetail({
        class: selectedClass._id,
      })
  }, [fetchDetail, selectedClass, user.position])

  const [values, setValues] = useState([])

  const onSubmit = async () => {
    try {
      await update(
        values.map((e) => ({
          ...e,
          service: MC_SERVICE.DAY_BOARDING,
        }))
      )
      navigate('/day-boarding')
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    setValues(
      selectedItem?.map((item: any) => ({
        ...item,
        isActive: item.register?.isActive ?? false,
      }))
    )
  }, [selectedItem])
  const onChange = useCallback((value: any, selectedItem?: any) => {
    setSelectedClass(selectedItem)
  }, [])
  return (
    <div className="card bg-white border-round-xl py-2 px-3">
      <div className="flex gap-2 align-items-center">
        <h1 className="text-xl ">Đăng ký dịch vụ bán trú</h1>
      </div>
      <Divider />
      <div className="flex justify-content-between">
        <AllInOneSelect
          placeholder="Chọn lớp"
          className="w-15rem"
          url={'/api/student/get-all-class'}
          optionLabel="name"
          optionValue="_id"
          // selectFirstItem={true}
          value={selectedClass}
          onChange={onChange}
        />
        <Button type="button" onClick={onSubmit} loading={loadingSubmit}>
          Cập nhật
        </Button>
      </div>

      <div className="my-2">
        <DataTable
          rowClassName={() => 'hover-highlight'}
          value={values}
          onRowClick={(e) => {
            setValues(
              values.map((item: any) =>
                item._id === e.data._id
                  ? {
                      ...item,
                      isActive: !e.data.isActive,
                    }
                  : item
              )
            )
          }}
          loading={!!loadingDetail}
          loadingIcon={
            <div className="absolute w-full h-full">
              <div className="skeleton-container">
                <div className="skeleton-placeholder skeleton-title"></div>
                <div className="skeleton-placeholder skeleton-content"></div>
                <div className="skeleton-placeholder skeleton-content"></div>
                <div className="skeleton-placeholder skeleton-content"></div>
                <div className="skeleton-placeholder skeleton-content"></div>
                <div className="skeleton-placeholder skeleton-content"></div>
              </div>
            </div>
          }
        >
          <Column header="STT" body={(rowData, { rowIndex }) => rowIndex + 1} />
          <Column header="VNEdu Id" field="vneduId" />
          <Column header="Tên" field="name" />
          <Column header="Ngày sinh" field="dateOfBirth" />
          <Column header="Giới tính" field="gender" />
          <Column
            header="Đăng ký bán trú"
            field="isActive"
            body={(rowData) => {
              return (
                <div className="flex align-items-center cursor-pointer">
                  <Checkbox checked={rowData.isActive} />{' '}
                  <span className="ml-2">Đăng ký</span>
                </div>
              )
            }}
          />
        </DataTable>
      </div>
    </div>
  )
}
export default observer(CreateDayBoarding)

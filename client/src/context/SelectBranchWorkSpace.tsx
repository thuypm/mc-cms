import clsx from 'clsx'
import { FilterSelectLazy } from 'components/InfiniteSelect/FilterSelect'
import { Button } from 'primereact/button'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BranchStatusEnum } from 'utils/constants/branch'
import { WorkspaceContext } from './workspace.context'

const SelectBranchWorkSpace = ({ showLogo = true, className = '' }) => {
  const { t } = useTranslation()
  const {
    user: { branch },
  } = useContext(WorkspaceContext)
  const [selectedBranch, setSelectedBrach] = useState(branch)
  useEffect(() => {
    setSelectedBrach(branch)
  }, [branch])

  return (
    <div
      className={clsx(
        'px-4 bg-white border-round-lg ',
        className ? className : ' shadow-2'
      )}
    >
      {showLogo ? (
        <div className="mb-4">
          <img src={'/images/logo-branch.svg'} alt="logo" />
        </div>
      ) : null}
      <div className="pb-2 w-full">
        <label htmlFor=" " className="font-semibold">
          {t('Select branch to continue')}
        </label>
      </div>

      <FilterSelectLazy
        className="w-30rem"
        // value={selectedBranch?._id ? [selectedBranch?._id] : []}
        // onChange={(e, selected) => {
        //   // setSelectedBrach(selected)
        // }}
        onSelectItem={(_, _val, selected) => {
          // setSelectedBrach({
          //   _id: selected?.[0]?.value,
          //   name: selected?.[0]?.label,
          // })
        }}
        customRender={(item, active, onChange) => {
          return (
            <div
              key={item.value}
              onClick={() => onChange()}
              className={clsx(
                'hover:bg-gray-100 my-3 flex gap-4 transition-duration-300  justify-content-between align-items-center overflow-hidden cursor-pointer  border-1 border-solid  border-round p-2',
                active ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
              )}
            >
              <div className="flex-auto overflow-hidden">
                <p className="mt-0 mb-2  text-overflow-ellipsis white-space-nowrap overflow-hidden font-medium">
                  {item.label}
                </p>
                <p className="m-0 text-gray-500 text-overflow-ellipsis white-space-nowrap overflow-hidden">
                  {item.address}
                </p>
              </div>
              {/* <RadioButton checked={active} className="flex-0" /> */}
            </div>
          )
        }}
        useRadio
        multiple={false}
        showFooter={false}
        url={`api/v1/branches?status=${BranchStatusEnum.Active}`}
        tranformData={(items) =>
          items.map((item) => ({
            label: item.name,
            value: item._id,
            address: item.address,
          }))
        }
        placeholder={t('Select one')}
      />

      <div className="w-full flex justify-content-center">
        <Button className="mt-4 mx-auto">{t('Continue')}</Button>
      </div>
    </div>
  )
}
export default SelectBranchWorkSpace

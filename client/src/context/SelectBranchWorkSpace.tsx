import clsx from 'clsx'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BRANCH_SELECT_OPTIONS } from 'utils/constants/common'

const SelectBranchWorkSpace = ({ showLogo = true, className = '' }) => {
  const { t } = useTranslation()
  const [selectedBranch, setSelectedBrach] = useState(null)
  useEffect(() => {
    // setSelectedBrach(branch)
  }, [])

  return (
    <div className="w-screen h-screen flex align-items-center justify-content-center">
      <div
        className={clsx(
          'p-4  bg-white border-round-lg flex flex-column align-items-center',
          className ? className : ' shadow-2'
        )}
      >
        <Dropdown
          className="w-15rem"
          value={selectedBranch}
          onChange={(e) => setSelectedBrach(e.value)}
          placeholder="Chọn cơ sở"
          options={BRANCH_SELECT_OPTIONS}
        />

        <div className="w-full flex justify-content-center">
          <Button
            disabled={!selectedBranch}
            className="mt-2 mx-auto"
            onClick={() => {
              if (selectedBranch) {
                localStorage.setItem('branchId', selectedBranch?._id)
                window.location.reload()
              }
            }}
          >
            {t('Continue')}
          </Button>
        </div>
      </div>
    </div>
  )
}
export default SelectBranchWorkSpace

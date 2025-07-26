import { useStore } from 'context/store'
import { observer } from 'mobx-react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import UploadFile from './Upload/UploadFile'

const ModalImportData = () => {
  const { t } = useTranslation()

  const [showModal, setShowModal] = useState(false)
  const {
    studentManagementStore: { handleFilterDataChange },
  } = useStore()

  return (
    <>
      <Button
        icon="isax-document-upload"
        label={t('Import csv')}
        outlined
        onClick={() => setShowModal(true)}
      ></Button>
      <Dialog
        onHide={() => {
          setShowModal(false)
          handleFilterDataChange({})
        }}
        headerClassName="pt-4"
        header={t('Import CSV File')}
        visible={showModal}
        style={{ width: '70vw' }}
        contentClassName="flex flex-column gap-3 overflow-auto"
      >
        <a href={'/テンプレート.csv'} title="link">
          {t('Example here')}
        </a>
        <UploadFile
          fetchData={() => handleFilterDataChange({})}
          onClose={() => {
            setShowModal(false)
            handleFilterDataChange({})
          }}
        />
      </Dialog>
    </>
  )
}

export default observer(ModalImportData)

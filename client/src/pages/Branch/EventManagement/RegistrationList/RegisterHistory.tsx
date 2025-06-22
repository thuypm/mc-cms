import FieldDetail from 'components/FieldDetail'
import { useStore } from 'context/store'
import { Dialog } from 'primereact/dialog'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import UserRegistrationHistory from './UserRegistrationHistory'

const RegisteredHistory = () => {
  const [showModalHistory, setShowModalHistory] = useState(false)
  const { t } = useTranslation()
  const {
    eventRegistrationStore: { selectedItem },
  } = useStore()
  return (
    <>
      <Dialog
        onHide={() => {
          setShowModalHistory(false)
        }}
        header={t('Registed History')}
        visible={showModalHistory}
        style={{ width: '80vw', height: '70vh' }}
      >
        <UserRegistrationHistory userId={selectedItem.customer._id} />
      </Dialog>
      <FieldDetail
        label={t('Registed History')}
        hiddenWhenEmpty={false}
        value={
          <ul className="pl-4 my-0">
            <li>
              {t('Registed')}:{' '}
              {selectedItem.customer?.registeredHistory.registeredNumber}
            </li>
            <li>
              {t('Canceled')}:{' '}
              {selectedItem.customer?.registeredHistory.canceledNumber}
            </li>
          </ul>
        }
        btnExpand={
          <div
            className="text-blue-500 cursor-pointer font-normal"
            onClick={() => setShowModalHistory(true)}
          >
            ({t('View')})
          </div>
        }
      />
    </>
  )
}

export default RegisteredHistory

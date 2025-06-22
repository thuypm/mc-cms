import { WorkspaceContext } from 'context/workspace.context'
import { observer } from 'mobx-react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { REACT_APP_END_USER } from 'utils/constants/environment'
import { copyToClipBoard } from 'utils/helper/common-helpers'
import { toast } from 'utils/toast'

const GetInviteLink = () => {
  const { t } = useTranslation()

  const {
    user: {
      branch: { _id },
    },
  } = useContext(WorkspaceContext)
  const [show, setShowModal] = useState(false)
  const link = useMemo(() => {
    return `${REACT_APP_END_USER}/customer/${_id}`
  }, [_id])
  return (
    <>
      <Button
        icon="isax-link-21-bold"
        label={t('Get invite link')}
        onClick={() => setShowModal(true)}
      ></Button>
      <Dialog
        onHide={() => {
          setShowModal(false)
        }}
        header={t('Your invite link')}
        visible={show}
        style={{ width: '500px' }}
      >
        <div className="p-inputgroup flex-1 w-full fllex">
          <Link target="_blank" to={link} className="flex-1">
            <InputText
              readOnly
              className="w-full cursor-pointer border-noround-right"
              value={link}
              onClick={() => {}}
            />
          </Link>
          <Button
            icon="isax-copy"
            onClick={() => {
              copyToClipBoard(link, () => {
                toast({
                  severity: 'success',
                  detail: t('Copied to clipboard'),
                  summary: t('Success'),
                })
              })
            }}
            className="p-button-warning"
          />
        </div>
      </Dialog>
    </>
  )
}
export default observer(GetInviteLink)

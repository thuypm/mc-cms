import axiosInstant from 'api/baseRequest'
import { observer } from 'mobx-react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { ProgressSpinner } from 'primereact/progressspinner'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { copyRichtTextHtml, copyToClipBoard } from 'utils/helper/common-helpers'
import { toast } from 'utils/toast'

const ModalResendMail = ({ registrationId }) => {
  const { t } = useTranslation()

  const [showModal, setShowModal] = useState(false)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [dataPreview, setDataPreview] = useState(null)
  const elemntRef = useRef<HTMLDivElement>(null)
  const getDataPreview = useCallback(async () => {
    setLoadingDetail(true)
    try {
      const res = await axiosInstant.request({
        url: `/api/v1/reservation/resend-preview/${registrationId}`,
      })
      setDataPreview(res.data)
    } catch (error) {
    } finally {
      setLoadingDetail(false)
    }
  }, [registrationId])
  useEffect(() => {
    if (showModal) getDataPreview()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal])

  return (
    <>
      <Button
        label={t('確認メール')}
        onClick={() => setShowModal(true)}
        className="h-fit"
      ></Button>
      <Dialog
        onHide={() => {
          setShowModal(false)
        }}
        header={t('確認メール')}
        visible={showModal}
        style={{ width: '60vw' }}
        contentClassName="flex flex-column gap-4 overflow-auto"
      >
        <div
          dangerouslySetInnerHTML={{ __html: dataPreview?.html }}
          ref={elemntRef}
          className="overflow-auto"
        ></div>
        {loadingDetail ? (
          <div className="flex justify-content-center align-items-center p-4">
            <ProgressSpinner />
          </div>
        ) : (
          <>
            <div className="flex w-full gap-3 justify-content-center">
              <Button
                label={t('コピー')}
                type="submit"
                className="w-fit"
                onClick={() => {
                  copyRichtTextHtml(elemntRef.current, () => {
                    toast({
                      severity: 'success',
                      detail: t('Copied to clipboard'),
                      summary: t('Success'),
                    })
                    setShowModal(false)
                  })
                }}
              />
              <Button
                label={t('再送信')}
                severity="secondary"
                type="button"
                className="w-fit"
                loading={loadingSubmit}
                onClick={async () => {
                  setLoadingSubmit(true)
                  try {
                    await axiosInstant.request({
                      url: `/api/v1/reservation/resend/${registrationId}`,
                      method: 'get',
                    })
                    setShowModal(false)
                    toast({
                      severity: 'success',
                      detail: t('確認メールを再送信しました'),
                      summary: t('Success'),
                    })
                  } catch (error) {
                  } finally {
                    setLoadingSubmit(false)
                  }
                }}
              />
            </div>
          </>
        )}
      </Dialog>
    </>
  )
}

export default observer(ModalResendMail)

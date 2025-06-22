import { useStore } from 'context/store'
import { observer } from 'mobx-react'
import { Dialog } from 'primereact/dialog'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
var regExp = new RegExp(/\{{.+?\}}/g)

const ExampleTemplate = () => {
  const { t } = useTranslation()
  const {
    emailTemplateStore: { selectedItem },
  } = useStore()
  const [showModal, setShowModal] = useState(false)

  const str = useMemo(() => {
    return selectedItem?.exampleTemplate?.replaceAll(
      regExp,
      (str) => `<span style="color: #9ca3af">${str}</span>`
    )
  }, [selectedItem?.exampleTemplate])
  return (
    <>
      <div onClick={() => setShowModal(true)} className="cursor-pointer">
        <i className="isax-info-circle text-2xl"></i>
      </div>
      <Dialog
        onHide={() => {
          setShowModal(false)
        }}
        closeOnEscape
        header={t('Example template')}
        visible={showModal}
        style={{ width: '60vw' }}
        contentClassName=""
      >
        <div
          dangerouslySetInnerHTML={{ __html: str }}
          className="ql-editor p-0"
        ></div>
      </Dialog>
    </>
  )
}

export default observer(ExampleTemplate)

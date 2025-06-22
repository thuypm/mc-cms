import clsx from 'clsx'
import FormField from 'components/FormField'
import ReactQuillEditor from 'components/QuillEditor'
import { useStore } from 'context/store'
import { observer } from 'mobx-react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { countCharactersEditor } from 'utils/constants/regex'
import UploadImage from '../Upload/UploadImage'
import { FileUploadStatus } from '../Upload/enum'
const defaultValues = {
  branchIds: [],
  content: '',
  attachments: [],
}
const ModalReply = () => {
  const { t } = useTranslation()

  const [showModal, setShowModal] = useState(false)
  const { control, handleSubmit, reset } = useForm({
    defaultValues,
    reValidateMode: 'onSubmit',
  })
  const {
    messageStore: { sendMessage, contextId, loadingSubmit },
  } = useStore()

  const onSubmit = async (values) => {
    const bodyTranform = {
      ...values,
      attachments: values.attachments?.map((item) => item.url),
      threadId: contextId,
    }

    try {
      await sendMessage(bodyTranform)
      setShowModal(false)
    } catch (error) {}
  }

  return (
    <>
      <Button
        label={t('Reply')}
        onClick={() => setShowModal(true)}
        className="h-fit"
      ></Button>
      <Dialog
        onHide={() => {
          setShowModal(false)
        }}
        header={t('Reply')}
        visible={showModal}
        style={{ width: '60vw' }}
        contentClassName="flex flex-column gap-4 overflow-auto"
      >
        <form
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
          className="p-fluid"
        >
          <FormField
            name="content"
            control={control}
            rules={{
              required: t('required', {
                field: t('Content'),
              }),
              validate: (value) => {
                const count = countCharactersEditor(value)
                if (count > 5000) return t('Please input < 5000 charators')
                if (count > 0) return null

                return t('required', {
                  field: t('Content'),
                })
              },
            }}
            render={({ field, fieldState }) => {
              return (
                <ReactQuillEditor
                  {...field}
                  placeholder={t('Content')}
                  className={clsx({
                    'p-invalid': fieldState.invalid,
                  })}
                />
              )
            }}
            label={t('Content')}
          />
          <Controller
            name="attachments"
            control={control}
            rules={{
              validate: (value) => {
                if (
                  value?.some((item) => item.status === FileUploadStatus.ERROR)
                )
                  return t('Please remove error file')
                if (
                  value?.some(
                    (item) =>
                      item.status === FileUploadStatus.PENDING ||
                      item.status === FileUploadStatus.UPLOADING
                  )
                )
                  return t('Please wait for upload success')
                return null
              },
            }}
            render={({ field: { value, onChange }, fieldState: { error } }) => {
              return (
                <div className="mb-4 mt-2">
                  <UploadImage value={value} onChange={onChange} />
                  {error ? (
                    <div className="text-red-500 mt-1">{error.message}</div>
                  ) : null}
                </div>
              )
            }}
          />
          <div className="flex w-full gap-3 justify-content-center">
            <Button
              label={t('Send')}
              type="submit"
              className="w-fit"
              loading={loadingSubmit}
            />
            <Button
              label={t('Cancel')}
              severity="secondary"
              type="button"
              className="w-fit"
              onClick={() => {
                reset(defaultValues)
                setShowModal(false)
              }}
            />
          </div>
        </form>
      </Dialog>
    </>
  )
}

export default observer(ModalReply)

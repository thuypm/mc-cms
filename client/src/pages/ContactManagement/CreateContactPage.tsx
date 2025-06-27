import clsx from 'clsx'
import FormField from 'components/FormField'
import ReactQuillEditor from 'components/QuillEditor'
import { useStore } from 'context/store'
import { observer } from 'mobx-react'
import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import { InputText } from 'primereact/inputtext'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { countCharactersEditor } from 'utils/constants/regex'
import { FileUploadStatus } from './Upload/enum'
import UploadImage from './Upload/UploadImage'

const defaultValues = {
  title: ``,
  branchIds: [],
  content: '',
  attachments: [],
}
const CreateContactPage = () => {
  const { t } = useTranslation()
  const {
    contactStore: {
      fetchDetail,
      create,
      selectedItem,

      setSelectedItem,
      loadingSubmit,
    },
  } = useStore()
  const navigate = useNavigate()
  const { control, handleSubmit, reset } = useForm({
    defaultValues,
    reValidateMode: 'onSubmit',
  })
  const { id } = useParams()

  const onSubmit = async (values) => {
    const bodyTranform = {
      ...values,
      attachments: values.attachments?.map((item) => item.url),
    }
    try {
      await create(bodyTranform)
      navigate('/contact-management')
    } catch (error) {}
  }

  useEffect(() => {
    if (selectedItem) reset({ ...selectedItem })
    else reset(defaultValues)
  }, [reset, selectedItem])

  useEffect(() => {
    if (id) fetchDetail(id)
    return () => {
      setSelectedItem(null)
    }
  }, [fetchDetail, id, setSelectedItem])

  return (
    <div className="card bg-white border-round-xl px-3 py-5">
      <div className="flex align-items-center gap-4  flex-1">
        <h1 className="text-3xl mb-0">
          {id
            ? t('Edit item', { item: t('Thread') })
            : t('Create item', { item: t('Thread') })}
        </h1>
        {/* {getBranchStatusTag(selectedItem?.status)} */}
      </div>
      <Divider />

      <form
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        className="p-fluid"
      >
        <FormField
          name="title"
          control={control}
          rules={{
            required: t('required', {
              field: t('Title'),
            }),
          }}
          render={({ field, fieldState }) => {
            return (
              <InputText
                {...field}
                maxLength={255}
                placeholder={t('Title')}
                className={clsx({
                  'p-invalid': fieldState.invalid,
                })}
              />
            )
          }}
          label={t('Title')}
        />

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
              if (value?.some((item) => item.status === FileUploadStatus.ERROR))
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
        <Divider />

        <div className="flex gap-4">
          <Button
            loading={loadingSubmit}
            type="submit"
            label={t('Create')}
            className="w-min"
          ></Button>
          <Button
            type="button"
            label={t('Cancel')}
            onClick={() => navigate('/contact-management')}
            severity="secondary"
            className="w-min"
          ></Button>
        </div>
      </form>
    </div>
  )
}
export default observer(CreateContactPage)

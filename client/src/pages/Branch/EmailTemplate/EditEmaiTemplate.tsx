import clsx from 'clsx'
import FormField from 'components/FormField'
import ReactQuillEditor from 'components/QuillEditor'
import { useStore } from 'context/store'
import { observer } from 'mobx-react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { ProgressSpinner } from 'primereact/progressspinner'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { countCharactersEditor } from 'utils/constants/regex'
import ExampleTemplate from './ExampleTemplate'
import { Divider } from 'primereact/divider'

const defaultValues = {
  _id: '',
  type: '',
  title: '',
  content: '',
}
const EditEmaiTemplate = () => {
  const { t } = useTranslation()

  const {
    emailTemplateStore: {
      fetchDetail,
      selectedItem,
      loadingSubmit,
      loadingDetail,
      setSelectedItem,
      update,
    },
  } = useStore()

  const { id } = useParams()

  const { control, handleSubmit, reset } = useForm({
    defaultValues,
  })

  useEffect(() => {
    reset(selectedItem)
  }, [reset, selectedItem])

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

  const onSubmit = async (values: any) => {
    try {
      await update(id, values)
      navigate('/email-template')
    } catch (error) {}
  }
  const navigate = useNavigate()

  return (
    <div className="card bg-white border-round-xl p-3">
      <h1 className="text-3xl flex gap-4 mb-0">
        {t('Email template edit')}

        <ExampleTemplate />
      </h1>
      <Divider />

      {loadingDetail ? (
        <div className="w-full h-full flex justify-content-center align-items-center">
          <ProgressSpinner />
        </div>
      ) : (
        <form
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
          className="p-fluid"
        >
          <FormField
            control={control}
            name="title"
            rules={{
              required: t('required', {
                field: t('Title'),
              }),
            }}
            render={({ field, fieldState }) => {
              return (
                <InputText
                  maxLength={255}
                  {...field}
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
            control={control}
            name="content"
            rules={{
              required: t('required', {
                field: t('Content'),
              }),
              validate: (value) => {
                const count = countCharactersEditor(value)
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
          <Divider />

          <div className="flex gap-4">
            <Button
              loading={loadingSubmit}
              type="submit"
              label={t('Save change')}
              className="w-max"
            ></Button>
            <Button
              label={t('Discard')}
              type="button"
              onClick={() => navigate('/email-template')}
              severity="secondary"
              className="w-min"
            ></Button>
          </div>
        </form>
      )}
    </div>
  )
}
export default observer(EditEmaiTemplate)

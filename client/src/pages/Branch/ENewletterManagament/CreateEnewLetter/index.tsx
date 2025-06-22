import clsx from 'clsx'
import DateTimePicker from 'components/DateTimePicker'
import FormField from 'components/FormField'
import { useStore } from 'context/store'
import { WorkspaceContext } from 'context/workspace.context'
import { observer } from 'mobx-react'
import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import { InputText } from 'primereact/inputtext'
import { ProgressSpinner } from 'primereact/progressspinner'
import { useContext, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { ScopeEnewLetter } from 'utils/constants/enewletter'
import { countCharactersEditor } from 'utils/constants/regex'
import { getEnewLetterStatusTag } from 'utils/helper/table'
import QuillUploadEditor from './QuillUploadEditor'
import ScopeSending from './ScopeSending'
import { useObjectSearchParams } from 'utils/hooks/useObjectSearchParams'
import { update } from 'lodash'

const defaultValues = {
  title: '',
  content: '',
  scheduledTime: null,

  sendAllInBranch: false,
  sendingEventIds: [],
  sendAllCustomers: false,
  sendingBranchIds: [],
  sendTo: null,
}
const CreateEnewLetter = () => {
  const { t } = useTranslation()

  const {
    enewLetterStore: {
      fetchDetail,
      create,
      selectedItem,
      loadingDetail,
      loadingSubmit,
      setSelectedItem,
      update,
    },
  } = useStore()
  const { id } = useParams()
  const {
    searchObject: { cloneId },
  } = useObjectSearchParams()
  useEffect(() => {
    if (cloneId) fetchDetail(cloneId)
    if (id) fetchDetail(id)
    return () => {
      setSelectedItem(null)
    }
  }, [fetchDetail, id, setSelectedItem, cloneId])

  const navigate = useNavigate()

  const form = useForm({
    defaultValues,
  })
  const { control, handleSubmit, reset } = form

  const { user } = useContext(WorkspaceContext)
  useEffect(() => {
    if (selectedItem) {
      if (cloneId)
        reset({
          ...selectedItem,
          scheduledTime: null,
          sendingBranchIds: selectedItem.sendingBranches
            ?.filter((e) => (e as any) !== -1)
            ?.map((item) => item._id),
          sendingEventIds: selectedItem.sendingEvents
            ?.filter((e) => (e as any) !== -1)
            ?.map((item) => item._id),
        })
      else if (selectedItem.createdBy?.role === user.role)
        reset({
          ...selectedItem,
          scheduledTime: new Date(selectedItem.scheduledTime),
          sendingBranchIds: selectedItem.sendingBranches
            ?.filter((e) => (e as any) !== -1)
            ?.map((item) => item._id),
          sendingEventIds: selectedItem.sendingEvents
            ?.filter((e) => (e as any) !== -1)
            ?.map((item) => item._id),
        })
      else navigate(`/enewletter-management/${id}`)
    } else reset(defaultValues)
  }, [id, navigate, reset, selectedItem, user.role])

  useEffect(() => {
    if (id) fetchDetail(id)

    return () => {
      setSelectedItem(null)
    }
  }, [fetchDetail, id, setSelectedItem])

  const onSubmit = async (values: any) => {
    const tranformValues = {
      ...values,
      sendTo:
        values.sendTo === ScopeEnewLetter.All
          ? ScopeEnewLetter.Event
          : values.sendTo,
    }
    try {
      if (id) await update(id, tranformValues)
      else await create(tranformValues)
      navigate('/enewletter-management')
    } catch (error) {}
  }

  return (
    <div className="card bg-white border-round-xl p-3">
      <div className="flex gap-2 align-items-center">
        <h1 className="text-3xl mb-0">
          {t(id ? 'Edit item' : 'Create item', {
            item: t('E-Newsletter'),
          })}
        </h1>
        {getEnewLetterStatusTag(selectedItem?.status)}
      </div>
      <Divider />

      {loadingDetail ? (
        <div className="w-full h-full flex justify-content-center align-items-center">
          <ProgressSpinner />
        </div>
      ) : (
        <FormProvider {...form}>
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
              control={control}
              name="scheduledTime"
              className="w-6 pr-2"
              rules={{
                required: t('required', {
                  field: t('Scheduled Time'),
                }),
                validate(v) {
                  if (new Date(v).getTime() < new Date().getTime())
                    return t('Scheduled Time must be after current time')
                  return null
                },
              }}
              render={({ field, fieldState }) => {
                return (
                  <DateTimePicker
                    {...field}
                    minDate={new Date()}
                    onChange={(value) => {
                      field.onChange(value)
                    }}
                    showTime={true}
                    placeholder={t('Scheduled Time')}
                    className={clsx('', {
                      'p-invalid': fieldState.invalid,
                    })}
                  />
                )
              }}
              label={t('Scheduled Time')}
            />
            <ScopeSending />
            <FormField
              control={control}
              name="content"
              required
              rules={{
                // required: t('required', {
                //   field: t('Content'),
                // }),
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
                  <QuillUploadEditor
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
                label={selectedItem ? t('Save') : t('Create')}
                className="w-max"
              ></Button>
              <Button
                label={t('Cancel')}
                type="button"
                onClick={() => navigate('/enewletter-management')}
                severity="secondary"
                className="w-min"
              ></Button>
            </div>
          </form>
        </FormProvider>
      )}
    </div>
  )
}
export default observer(CreateEnewLetter)

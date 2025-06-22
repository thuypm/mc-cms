import clsx from 'clsx'
import FormField from 'components/FormField'
import { useStore } from 'context/store'
import { observer } from 'mobx-react'
import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { EMAIL_REGEX } from 'utils/constants/regex'
import { getBranchStatusTag } from 'utils/helper/table'

const defaultValues = {
  name: ``,
  email: ``,
  address: ``,
  phoneNumber: ``,
  personInCharged: ``,
  note: '',
  status: '',
}
const CreateBranchPage = () => {
  const { t } = useTranslation()
  const {
    branchManagementStore: {
      fetchDetail,
      create,
      selectedItem,
      update,
      setSelectedItem,
      loadingSubmit,
    },
  } = useStore()
  const navigate = useNavigate()

  const { control, handleSubmit, reset } = useForm({
    defaultValues,
  })
  const { id } = useParams()

  const onSubmit = async (values) => {
    try {
      if (id) await update(id, values)
      else await create(values)
      navigate('/branch-management')
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
      <div className="flex align-items-center gap-4 flex-1">
        <h1 className="text-3xl m-0">
          {id
            ? t('Edit item', { item: t('Branch') })
            : t('Create item', { item: t('Branch') })}
        </h1>
        {getBranchStatusTag(selectedItem?.status)}
      </div>
      <Divider />

      <form
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        className="p-fluid"
      >
        <FormField
          name="name"
          control={control}
          rules={{
            required: t('required', {
              field: t('Branch Name'),
            }),
          }}
          render={({ field, fieldState }) => {
            return (
              <InputText
                {...field}
                maxLength={255}
                placeholder={t('Branch Name')}
                className={clsx({
                  'p-invalid': fieldState.invalid,
                })}
              />
            )
          }}
          label={t('Branch Name')}
        />
        <FormField
          control={control}
          name="email"
          rules={{
            required: t('required', {
              field: t('Email'),
            }),
            pattern: {
              value: EMAIL_REGEX,
              message: t('invalid', {
                field: t('Email'),
              }),
            },
          }}
          render={({ field, fieldState }) => {
            return (
              <InputText
                maxLength={255}
                {...field}
                placeholder={t('Email')}
                className={clsx({
                  'p-invalid': fieldState.invalid,
                })}
              />
            )
          }}
          label={t('Email')}
        />{' '}
        <FormField
          name="address"
          control={control}
          rules={{
            required: t('required', {
              field: t('Address'),
            }),
          }}
          render={({ field, fieldState }) => {
            return (
              <InputText
                maxLength={255}
                {...field}
                placeholder={t('Address')}
                className={clsx({
                  'p-invalid': fieldState.invalid,
                })}
              />
            )
          }}
          label={t('Address')}
        />
        <FormField
          name="phoneNumber"
          control={control}
          rules={{
            required: t('required', {
              field: t('Phone Number'),
            }),
            validate: (value) => {
              if (/^\d{10,11}$/.test(value) || !value?.length) return null
              return t('半角数字で-を入れずに10～11桁で入力してください')
            },
          }}
          render={({ field, fieldState }) => {
            return (
              <InputText
                {...field}
                keyfilter={'int'}
                maxLength={15}
                placeholder={t('Phone Number')}
                className={clsx({
                  'p-invalid': fieldState.invalid,
                })}
              />
            )
          }}
          label={t('Phone Number')}
        />
        <FormField
          name="personInCharged"
          control={control}
          render={({ field, fieldState }) => {
            return (
              <InputText
                {...field}
                maxLength={255}
                placeholder={t('Person in charged')}
                className={clsx({
                  'p-invalid': fieldState.invalid,
                })}
              />
            )
          }}
          label={t('Person in charged')}
        />
        <FormField
          name="note"
          control={control}
          render={({ field, fieldState }) => {
            return (
              <InputTextarea
                {...field}
                placeholder={t('Note')}
                maxLength={500}
                className={clsx({
                  'p-invalid': fieldState.invalid,
                })}
              />
            )
          }}
          label={t('Note')}
        />
        <Divider />
        <div className="flex gap-4">
          <Button
            loading={loadingSubmit}
            type="submit"
            label={id ? t('Save') : t('Create')}
            className="w-min"
          ></Button>
          <Button
            type="button"
            label={t('Cancel')}
            onClick={() => navigate('/branch-management')}
            severity="secondary"
            className="w-min"
          ></Button>
        </div>
      </form>
    </div>
  )
}
export default observer(CreateBranchPage)

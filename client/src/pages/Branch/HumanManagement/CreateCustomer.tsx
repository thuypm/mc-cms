import clsx from 'clsx'
import FormField from 'components/FormField'
import { useStore } from 'context/store'
import { observer } from 'mobx-react'
import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { ProgressSpinner } from 'primereact/progressspinner'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { CustomerStatusEnum } from 'utils/constants/customer'
import { EMAIL_REGEX, furiganaRegex } from 'utils/constants/regex'
import { branchRouterId } from 'utils/constants/user'
import { getCustomerStatusTag } from 'utils/helper/table'

const defaultValues = {
  _id: '',
  email: '',
  name: '',
  furigana: '',
  phoneNumber: '',
  registeredBy: '',
  status: '',
  branchId: branchRouterId,
}
const CreateCustomer = () => {
  const { t } = useTranslation()

  const {
    studentManagementStore: {
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

  const { control, handleSubmit, reset } = useForm({
    defaultValues,
  })
  const navigate = useNavigate()

  useEffect(() => {
    reset(selectedItem)
  }, [reset, selectedItem])

  useEffect(() => {
    if (selectedItem)
      if (selectedItem.status === CustomerStatusEnum.Blocked)
        navigate(`/customer-management/${selectedItem._id}`)
      else reset({ ...selectedItem })
    else reset(defaultValues)
  }, [navigate, reset, selectedItem])
  useEffect(() => {
    if (id) fetchDetail(id)

    return () => {
      setSelectedItem(null)
    }
  }, [fetchDetail, id, setSelectedItem])

  const onSubmit = async (values: any) => {
    try {
      if (id) await update(id, values)
      else await create(values)
      navigate('/customer-management')
    } catch (error) {}
  }

  return (
    <div className="card bg-white border-round-xl p-3">
      <div className="flex gap-4 align-items-center mt-3">
        <h1 className="text-3xl my-0">
          {id ? t('Edit item', { item: t('customer') }) : '顧客登録'}
        </h1>

        {getCustomerStatusTag(selectedItem?.status)}
      </div>
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
            name="name"
            rules={{
              required: t('required', {
                field: t('Name'),
              }),
            }}
            render={({ field, fieldState }) => {
              return (
                <InputText
                  {...field}
                  maxLength={255}
                  placeholder={t('Name')}
                  className={clsx({
                    'p-invalid': fieldState.invalid,
                  })}
                />
              )
            }}
            label={t('Customer name')}
          />
          <FormField
            control={control}
            name="furigana"
            rules={{
              required: t('required', {
                field: t('Furigana'),
              }),
              validate(value) {
                return furiganaRegex.test(value)
                  ? null
                  : t('Please input Katakana fullwidth without space')
              },
            }}
            className="w-full"
            render={({ field, fieldState }) => {
              return (
                <>
                  <InputText
                    {...field}
                    maxLength={255}
                    placeholder={t(
                      'Please input Katakana fullwidth without space'
                    )}
                    className={clsx({
                      'p-invalid': fieldState.invalid,
                    })}
                  />
                </>
              )
            }}
            label={t('Furigana')}
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
          />

          <FormField
            control={control}
            name="phoneNumber"
            rules={{
              validate: (value) => {
                if (/^\d{10,11}$/.test(value) || !value?.length) return null
                return t('半角数字で-を入れずに10～11桁で入力してください')
              },
            }}
            render={({ field, fieldState }) => {
              return (
                <InputText
                  {...field}
                  maxLength={12}
                  keyfilter={'int'}
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
            name="note"
            control={control}
            render={({ field, fieldState }) => {
              return (
                <InputTextarea
                  {...field}
                  maxLength={500}
                  placeholder={t('About this Customer')}
                  className={clsx({
                    'p-invalid': fieldState.invalid,
                  })}
                />
              )
            }}
            label={t('About this Customer')}
          />
          <Divider />
          <div className="flex gap-4">
            <Button
              loading={loadingSubmit}
              type="submit"
              label={id ? t('Save') : t('登録')}
              className="w-max"
            ></Button>
            <Button
              label={t('Cancel')}
              type="button"
              onClick={() => navigate('/customer-management')}
              severity="secondary"
              className="w-min"
            ></Button>
          </div>
        </form>
      )}
    </div>
  )
}
export default observer(CreateCustomer)

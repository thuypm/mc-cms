import clsx from 'clsx'
import Empty from 'components/Empty'
import FormField from 'components/FormField'
import { useStore } from 'context/store'
import { observer } from 'mobx-react'
import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { ProgressSpinner } from 'primereact/progressspinner'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { EMAIL_REGEX, furiganaRegex } from 'utils/constants/regex'
import RegisteredHistory from './RegisterHistory'
import { getRegistrationStatusTag } from 'utils/helper/table'
import InputNumberCustom from 'components/InputNumberCustom'

const defaultValues = {
  _id: '',
  email: '',
  name: '',
  furigana: '',
  phoneNumber: '',
  guest: 1,
  status: null,
  note: '',
  customerNote: '',
}
const EditRegistration = () => {
  const {
    eventRegistrationStore: {
      fetchDetail,
      selectedItem,
      loadingSubmit,
      setSelectedItem,
      update,
      loadingDetail,
    },
  } = useStore()

  const { registrationId } = useParams()
  const { t } = useTranslation()
  const form = useForm<any>({
    defaultValues,
  })

  const { handleSubmit, reset } = form
  useEffect(() => {
    reset(selectedItem)
  }, [reset, selectedItem])

  useEffect(() => {
    if (selectedItem)
      reset({
        ...selectedItem,
        customerNote: selectedItem.customer.note,
      })
    else reset(defaultValues)
  }, [reset, selectedItem])

  useEffect(() => {
    if (registrationId) fetchDetail(registrationId)

    return () => {
      setSelectedItem(null)
    }
  }, [fetchDetail, registrationId, setSelectedItem])

  const onSubmit = async (values: any) => {
    try {
      try {
        if (registrationId) await update(registrationId, values)
        else {
          // await create({
          //   ...values,
          //   questions: values.questions.map((e, index) => ({
          //     ...e,
          //     order: index,
          //   })),
          // })
        }
        navigate(-1)
      } catch (error) {
        console.log(error)
      }
    } catch (error) {}
  }
  const navigate = useNavigate()

  return (
    <div className="card bg-white border-round-xl px-3 py-5">
      {loadingDetail ? (
        <div className="w-full h-full flex justify-content-center align-items-center">
          <ProgressSpinner />
        </div>
      ) : selectedItem ? (
        <FormProvider {...form}>
          <div className="flex gap-4 align-items-center">
            <h1 className="text-3xl flex gap-4 m-0">
              {t('Edit Registration')}
            </h1>

            {getRegistrationStatusTag(selectedItem?.status)}
          </div>
          <Divider />
          <form
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
            className="p-fluid"
          >
            <FormField
              control={form.control}
              name="name"
              rules={{
                required: t('required', {
                  field: t('Name'),
                }),
              }}
              className="w-full"
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
              label={t('Name')}
            />
            <FormField
              control={form.control}
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
                  <InputText
                    {...field}
                    maxLength={255}
                    placeholder={t('Furigana')}
                    className={clsx({
                      'p-invalid': fieldState.invalid,
                    })}
                  />
                )
              }}
              label={t('Furigana')}
            />
            <FormField
              control={form.control}
              name="email"
              className="w-full"
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
                    {...field}
                    maxLength={255}
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
              control={form.control}
              name="phoneNumber"
              rules={{
                required: t('required', {
                  field: t('Phone number'),
                }),
                validate: (value) => {
                  if (/^\d{10,11}$/.test(value) || !value?.length) return null
                  return t('半角数字で-を入れずに10～11桁で入力してください')
                },
              }}
              className="w-full"
              render={({ field, fieldState }) => {
                return (
                  <InputText
                    {...field}
                    maxLength={15}
                    placeholder={t('Phone number')}
                    className={clsx({
                      'p-invalid': fieldState.invalid,
                    })}
                  />
                )
              }}
              label={t('Phone number')}
            />
            <Divider className="border-dashed-divider" />
            <div className="flex gap-4 mb-4">
              <div className="font-semibold ">{t('Registering event')}</div>
              <div>{selectedItem.event?.title}</div>
            </div>
            {selectedItem.event.applicationUnit === 'Single' ? null : (
              <FormField
                control={form.control}
                name="guest"
                className="w-full"
                rules={{
                  required: t('required', { field: t('Guest') }),
                  validate: (value) => {
                    if (value < 1) return t('Guest must not be less than 1')
                  },
                }}
                render={({ field, fieldState }) => {
                  return (
                    <InputNumberCustom
                      {...field}
                      maxLength={10}
                      placeholder={t('Guest')}
                      className={clsx({
                        'p-invalid': fieldState.invalid,
                      })}
                      onChange={(e) => field.onChange(e.value)}
                    />
                  )
                }}
                label={t('Guest')}
              />
            )}
            <FormField
              control={form.control}
              name="note"
              className="w-full"
              render={({ field, fieldState }) => {
                return (
                  <InputTextarea
                    {...field}
                    maxLength={500}
                    placeholder={t('Note')}
                    className={clsx({
                      'p-invalid': fieldState.invalid,
                    })}
                  />
                )
              }}
              label={t('Note')}
            />{' '}
            <Divider className="border-dashed-divider" />
            <RegisteredHistory />
            <FormField
              control={form.control}
              name="customerNote"
              className="w-full"
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
                label={t('Save change')}
                className="w-max"
              ></Button>
              <Button
                label={t('Discard')}
                type="button"
                onClick={() => navigate(-1)}
                severity="secondary"
                className="w-min"
              ></Button>
            </div>
          </form>
        </FormProvider>
      ) : (
        <Empty />
      )}
    </div>
  )
}
export default observer(EditRegistration)

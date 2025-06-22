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

const HeadQuarterInfoEdit = () => {
  const { t } = useTranslation()

  const {
    headQuarterInfoStore: {
      fetchDetail,
      selectedItem,
      loadingSubmit,
      setSelectedItem,
      update,
    },
  } = useStore()

  const { id } = useParams()

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      address: '',
      email: '',
      phoneNumber: '',
      note: '',
    },
  })

  useEffect(() => {
    reset(selectedItem)
  }, [reset, selectedItem])

  useEffect(() => {
    if (selectedItem) reset({ ...selectedItem })
  }, [reset, selectedItem])
  useEffect(() => {
    fetchDetail()

    return () => {
      setSelectedItem(null)
    }
  }, [fetchDetail, id, setSelectedItem])

  const onSubmit = async (values: any) => {
    try {
      await update(values)
      navigate(-1)
    } catch (error) {}
  }
  const navigate = useNavigate()

  return (
    <div className="card bg-white border-round-xl px-3 py-5">
      <h1 className="text-3xl m-0">{t('Headquarter Info Edit')}</h1>
      <Divider />

      <form
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        className="p-fluid"
      >
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
                {...field}
                placeholder={t('enter', {
                  field: t('Email'),
                })}
                maxLength={255}
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
          name="address"
          rules={{
            required: t('required', {
              field: t('Address'),
            }),
          }}
          render={({ field, fieldState }) => {
            return (
              <InputText
                {...field}
                maxLength={255}
                placeholder={t('enter', {
                  field: t('Address'),
                })}
                className={clsx({
                  'p-invalid': fieldState.invalid,
                })}
              />
            )
          }}
          label={t('Address')}
        />
        <FormField
          control={control}
          name="phoneNumber"
          rules={{
            required: t('required', {
              field: t('Phone number'),
            }),
            validate: (value) => {
              if (/^\d+$/.test(value)) return null
              return t(
                'Phone number must contain full number and have maximum of 15 charactors'
              )
            },
          }}
          render={({ field, fieldState }) => {
            return (
              <InputText
                {...field}
                maxLength={12}
                placeholder={t('enter', {
                  field: t('Phone number'),
                })}
                className={clsx({
                  'p-invalid': fieldState.invalid,
                })}
              />
            )
          }}
          label={t('Phone number')}
        />
        <FormField
          name="note"
          control={control}
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
    </div>
  )
}
export default observer(HeadQuarterInfoEdit)

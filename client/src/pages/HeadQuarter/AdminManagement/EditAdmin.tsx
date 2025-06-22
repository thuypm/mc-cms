import clsx from 'clsx'
import AllInOneSelect from 'components/AllInOneSelect'
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
import { EMAIL_REGEX } from 'utils/constants/regex'
import { UserRoleEnum } from 'utils/constants/user'

const defaultValues = {
  fullName: '',
  branch: null,
  email: '',
  phoneNumber: '',
  status: null,
  note: '',
}
const EditAdmin = () => {
  const { t } = useTranslation()

  const {
    adminManagementStore: {
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
    if (selectedItem)
      reset({
        ...selectedItem,
        branch:
          (selectedItem.branch as any) === -1 ? -1 : selectedItem.branch?._id,
      })
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
      navigate('/admin-management')
    } catch (error) {}
  }
  const navigate = useNavigate()

  return (
    <div className="card bg-white border-round-xl p-3">
      <h1 className="text-3xl m-0">{t('Admin account update')}</h1>
      <Divider />
      {loadingDetail ? (
        <div className="w-full h-full flex justify-content-center align-items-center">
          <ProgressSpinner />
        </div>
      ) : selectedItem ? (
        <form
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
          className="p-fluid"
        >
          {selectedItem?.role === UserRoleEnum.Headquarter ? (
            <FormField
              name="branch"
              control={control}
              render={({ field, fieldState }) => {
                return (
                  <InputText
                    {...field}
                    value={t('Headquarter')}
                    readOnly
                    disabled
                    className={clsx({
                      'p-invalid': fieldState.invalid,
                    })}
                  />
                )
              }}
              label={t('Branch')}
            />
          ) : (
            <FormField
              name="branch"
              control={control}
              render={({ field, fieldState }) => {
                return (
                  <AllInOneSelect
                    placeholder={t('Select branch')}
                    url={`api/v1/branches`}
                    disabled
                    tranformData={(items) => {
                      if (
                        !field.value ||
                        items.find((e) => e?._id === field.value)
                      )
                        return items.map((e) => ({
                          label: e.name,
                          value: e?._id,
                        }))
                      else
                        return [
                          {
                            value: field.value,
                            label: t('Item is deleted', { item: t('Branch') }),
                          },
                          ...items.map((e) => ({
                            label: e.name,
                            value: e._id,
                          })),
                        ]
                    }}
                    className={clsx({
                      'p-invalid': fieldState.invalid,
                    })}
                    {...field}
                    // optionValue="_id"
                    // optionLabel="name"
                  />
                )
              }}
              label={t('Branch')}
            />
          )}

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
                  disabled
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
            name="fullName"
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
                  placeholder={t('enter', { field: t('Name') })}
                  className={clsx({
                    'p-invalid': fieldState.invalid,
                  })}
                />
              )
            }}
            label={t('Name')}
          />
          <FormField
            control={control}
            name="phoneNumber"
            rules={{
              validate: (value) => {
                if (/^\d+$/.test(value) || !value?.length) return null
                return t(
                  'Phone number must contain full number and have maximum of 15 charactors'
                )
              },
            }}
            render={({ field, fieldState }) => {
              return (
                <InputText
                  {...field}
                  maxLength={15}
                  disabled
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
          {/* <FormField
          control={control}
          name="status"
          render={({ field, fieldState }) => {
            return (
              <Dropdown
                options={Object.values(UserStatusEnum).map((item) => ({
                  label: t(item),
                  value: item,
                }))}
                {...field}
                disabled
                placeholder={t('Status')}
                className={clsx({
                  'p-invalid': fieldState.invalid,
                })}
              />
            )
          }}
          label={t('Status')}
        /> */}
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
              onClick={() => navigate('/admin-management')}
              severity="secondary"
              className="w-min"
            ></Button>
          </div>
        </form>
      ) : null}
    </div>
  )
}
export default observer(EditAdmin)

import clsx from 'clsx'
import AllInOneSelect from 'components/AllInOneSelect'
import FormField from 'components/FormField'
import { useStore } from 'context/store'
import { observer } from 'mobx-react'
import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { BranchStatusEnum } from 'utils/constants/branch'
import { EMAIL_REGEX } from 'utils/constants/regex'
import { USER_ROLES, UserRoleEnum } from 'utils/constants/user'

const CreateAdminManagement = () => {
  const { t } = useTranslation()
  const {
    adminManagementStore: { create, loadingSubmit },
  } = useStore()

  const {
    control,

    handleSubmit,
  } = useForm({
    defaultValues: {
      email: '',
      branch: null,
      role: null,
      fullName: '',
    },
  })
  const navigate = useNavigate()

  const onSubmit = async (values) => {
    try {
      await create({
        email: values.email,
        branchId: values.branch?._id ?? values.branch,
        role: values.role,
        fullName: values.fullName,
      })
      navigate('/admin-management')
    } catch (error) {}
  }

  const role = useWatch({ name: 'role', control })

  return (
    <div className="card bg-white border-round-xl px-3 py-5">
      <h1 className="text-3xl m-0">{t('Invite New Admin')}</h1>
      <Divider />

      <form
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        className="p-fluid"
      >
        <FormField
          name="role"
          control={control}
          rules={{
            required: t('required', {
              field: t('Role'),
            }),
          }}
          render={({ field, fieldState }) => {
            return (
              <Dropdown
                {...field}
                placeholder={t('Role')}
                options={USER_ROLES.map((item) => ({
                  label: t(item.label),
                  value: item.value,
                }))}
                className={clsx({
                  'p-invalid': fieldState.invalid,
                })}
              />
            )
          }}
          label={t('Role')}
        />
        {role === UserRoleEnum.BranchAdmin ? (
          <FormField
            name="branch"
            control={control}
            rules={{
              required: t('required', {
                field: t('Branch'),
              }),
            }}
            render={({ field, fieldState }) => {
              return (
                <AllInOneSelect
                  {...field}
                  tranformData={(items) =>
                    items.map((e) => ({ label: e.name, value: e._id }))
                  }
                  onChange={(e) => field.onChange(e.value)}
                  placeholder={t('Branch')}
                  url={`api/v1/branches?status=${BranchStatusEnum.Active}`}
                  className={clsx({
                    'p-invalid': fieldState.invalid,
                  })}
                />
              )
            }}
            label={t('Branch')}
          />
        ) : null}

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
                placeholder={t('Name')}
                className={clsx({
                  'p-invalid': fieldState.invalid,
                })}
              />
            )
          }}
          label={t('Name')}
        />
        <Divider />

        <div className="flex gap-4">
          <Button
            type="submit"
            loading={loadingSubmit}
            label={t('Invite')}
            className="w-min"
          ></Button>
          <Button
            type="button"
            label={t('Cancel')}
            onClick={() => navigate('/admin-management')}
            severity="secondary"
            className="w-min"
          ></Button>
        </div>
      </form>
    </div>
  )
}
export default observer(CreateAdminManagement)

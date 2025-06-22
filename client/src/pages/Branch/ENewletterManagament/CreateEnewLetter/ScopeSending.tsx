import clsx from 'clsx'
import FormField from 'components/FormField'
import { WorkspaceContext } from 'context/workspace.context'
import { observer } from 'mobx-react'
import { Dropdown } from 'primereact/dropdown'
import { useContext } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ScopeEnewLetter } from 'utils/constants/enewletter'
import { UserRoleEnum } from 'utils/constants/user'
import ScopeSelectbox from './ScopeSelectbox'

const ScopeSending = () => {
  const { t } = useTranslation()

  const { watch, control, setValue, getValues, reset } = useFormContext()

  const scope = watch('sendTo')
  const { user } = useContext(WorkspaceContext)
  return (
    <div
      className="gap-4"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
      }}
    >
      <FormField
        name="sendTo"
        className=""
        control={control}
        required
        rules={{
          required: t('required', {
            field: t('To'),
          }),
        }}
        render={({ field, fieldState }) => {
          return (
            <Dropdown
              {...field}
              placeholder={t('Select Branch Customer or Event’s Customer')}
              options={[
                {
                  label: t('Event’s Customer'),
                  value: ScopeEnewLetter.Event,
                },
                user.role === UserRoleEnum.Headquarter
                  ? {
                      label: t('Branch Customer'),
                      value: ScopeEnewLetter.Branch,
                    }
                  : {
                      label: t('All customer'),
                      value: ScopeEnewLetter.Branch,
                    },
              ]}
              onChange={(e) => {
                field.onChange(e)

                reset({
                  ...getValues(),
                  sendAllInBranch: false,
                  sendingBranchIds: [],
                  sendingEventIds: [],
                  sendAllCustomers: false,
                  sendAllEvents: false,
                })
              }}
              className={clsx({
                'p-invalid': fieldState.invalid,
              })}
            />
          )
        }}
        label={t('To')}
      />
      {scope === ScopeEnewLetter.Branch ? (
        user.role === UserRoleEnum.BranchAdmin ? null : (
          <FormField
            name="sendingBranchIds"
            className=""
            control={control}
            required
            rules={{
              validate: (value) => {
                if (!getValues().sendAllCustomers && !value?.length)
                  return t('required', {
                    field: t('Branch'),
                  })
                return null
              },
            }}
            render={({ field, fieldState }) => {
              return (
                <ScopeSelectbox
                  {...field}
                  firstItems={[
                    {
                      name: t('All branch'),
                      _id: ScopeEnewLetter.All,
                    },
                  ]}
                  value={{
                    isSelectALl: watch('sendAllCustomers'),
                    selected: field.value,
                  }}
                  onChange={(value) => {
                    if (value.isSelectALl) {
                      field.onChange([])
                      setValue('sendAllCustomers', true)
                    } else {
                      field.onChange(value?.selected)
                      setValue('sendAllCustomers', false)
                    }
                  }}
                  placeholder={t('Select branch')}
                  url={`api/v1/branches`}
                  className={clsx({
                    'p-invalid': fieldState.invalid,
                  })}
                />
              )
            }}
            label={t('Branch')}
          />
        )
      ) : scope === ScopeEnewLetter.Event ? (
        <FormField
          name="sendingEventIds"
          className=""
          control={control}
          required
          rules={{
            validate: (value) => {
              if (!getValues().sendAllEvents && !value?.length)
                return t('required', {
                  field: t('Event'),
                })
              return null
            },
          }}
          render={({ field, fieldState }) => {
            return (
              <ScopeSelectbox
                {...field}
                firstItems={[
                  {
                    title: t('All event'),
                    _id: ScopeEnewLetter.All,
                  },
                ]}
                value={{
                  isSelectALl: watch('sendAllEvents'),
                  selected: field.value,
                }}
                onChange={(value) => {
                  if (value.isSelectALl) {
                    field.onChange([])
                    setValue('sendAllEvents', true)
                  } else {
                    field.onChange(value?.selected)
                    setValue('sendAllEvents', false)
                  }
                }}
                optionLabel="title"
                placeholder={t('Select event')}
                url={`api/v1/event`}
                className={clsx({
                  'p-invalid': fieldState.invalid,
                })}
              />
            )
          }}
          label={t('Event')}
        />
      ) : null}
    </div>
  )
}
export default observer(ScopeSending)

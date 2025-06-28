import axiosInstant from 'api/baseRequest'
import clsx from 'clsx'
import FormField from 'components/FormField'
import { WorkspaceContext } from 'context/workspace.context'
import { observer } from 'mobx-react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { REACT_APP_SERVER_API } from 'utils/constants/environment'
import { EMAIL_REGEX } from 'utils/constants/regex'
import { toast } from 'utils/toast'

const EditProfile = () => {
  const { t } = useTranslation()

  const [showModal, setShowModal] = useState(false)
  const { user, fetchUser } = useContext(WorkspaceContext)
  const defaultValues = {
    email: '',
    fullName: '',
    phoneNumber: '',
  }

  const { control, handleSubmit, reset } = useForm({ defaultValues })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    reset({
      email: user.email,
      // fullName: user.fullName,
      // phoneNumber: user.phoneNumber,
    })
  }, [reset, user])
  const onSubmit = async (body) => {
    setLoading(true)
    try {
      await axiosInstant.request({
        method: 'put',
        url: '/api/v1/auth/me',
        baseURL: REACT_APP_SERVER_API,

        data: body,
      })
      toast({
        severity: 'success',
        detail: t('Updated item', { item: t('Profile') }),
        summary: t('Success'),
      })
      setShowModal(false)
      fetchUser()
    } catch (error) {
      // toast({
      //   severity: 'error',
      //   detail: error?.response?.data?.message
      //     ? error?.response?.data?.message
      //     : t('Updated'),
      //   summary: t('Error'),
      // })
    } finally {
      setLoading(false)
    }
    reset()
  }

  return (
    <>
      <Button
        label={t('Update profile')}
        onClick={() => setShowModal(true)}
      ></Button>
      <Dialog
        onHide={() => {
          setShowModal(false)
        }}
        header={t('Update profile')}
        visible={showModal}
        style={{ width: '400px' }}
        contentClassName="flex flex-column gap-4 overflow-auto"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
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
          <Button
            type="submit"
            loading={loading}
            label={t('Submit')}
            icon={'isax-send-2'}
            className="justify-content-center flex"
          ></Button>
        </form>
      </Dialog>
    </>
  )
}

export default observer(EditProfile)

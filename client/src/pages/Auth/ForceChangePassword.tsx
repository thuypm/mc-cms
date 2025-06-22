import axios from 'axios'
import { clsx } from 'clsx'
import FormField from 'components/FormField'
import i18n from 'i18n'
import Cookies from 'js-cookie'
import AuthLayout from 'layouts/AuthLayout'
import { Button } from 'primereact/button'
import { Password } from 'primereact/password'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { REACT_APP_SERVER_API } from 'utils/constants/environment'

const ForceChangePassword = () => {
  const { t } = useTranslation()
  const defaultValues = {
    password: '',
    retypePassword: '',
  }
  const [errorBackend, setErrorBackend] = useState('')

  const { control, handleSubmit, reset, getValues } = useForm({ defaultValues })
  const [loading, setLoading] = useState(false)

  const onSubmit = async (body) => {
    setLoading(true)
    try {
      setErrorBackend('')
      await axios.request({
        method: 'post',
        url: '/api/v1/auth/change-password',
        baseURL: REACT_APP_SERVER_API,
        headers: {
          Authorization: `Bearer ${Cookies.get('accessToken')}`,

          'Accept-Language': i18n.language === 'jp' ? 'ja' : 'en',
        },
        data: {
          newPassword: body.password,
        },
      })
      window.location.reload()
    } catch (error) {
      setErrorBackend(error?.response?.data?.message)
    } finally {
      setLoading(false)
    }
    reset()
  }

  return (
    <AuthLayout>
      <div>
        <div className="text-4xl font-bold">{t('Change password')}</div>
        <div className="text-gray-500">
          {t('This is your first time logging in, please enter a new password')}
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
          <FormField
            label={t('New password')}
            name="password"
            control={control}
            rules={{ required: t('') }}
            render={({ field, fieldState }) => (
              <Password
                {...field}
                placeholder={t('enter', {
                  field: t('Password'),
                })}
                toggleMask
                maxLength={50}
                feedback={false}
                className={clsx({
                  'p-invalid': fieldState.invalid,
                })}
              />
            )}
          />
          <FormField
            label={t('Retype your password')}
            name="retypePassword"
            control={control}
            rules={{
              required: t('Please retype your password'),

              validate: (val: string) => {
                if (getValues().password !== val) {
                  return t('Your passwords do no match')
                }
              },
            }}
            render={({ field, fieldState }) => (
              <Password
                {...field}
                placeholder={t('Retype your password')}
                feedback={false}
                toggleMask
                maxLength={50}
                className={clsx({
                  'p-invalid': fieldState.invalid,
                })}
              />
            )}
          />

          <Button
            type="submit"
            loading={loading}
            label={t('Submit')}
            icon={'isax-send-2'}
            className="justify-content-center flex mt-6"
          ></Button>
          {errorBackend ? (
            <div className="p-error my-1">{errorBackend}</div>
          ) : null}
        </form>
      </div>
    </AuthLayout>
  )
}
export default ForceChangePassword

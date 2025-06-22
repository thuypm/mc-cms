import axiosInstant from 'api/baseRequest'
import FormField from 'components/FormField'
import AuthLayout from 'layouts/AuthLayout'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { clsx } from 'clsx'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { EMAIL_REGEX } from 'utils/constants/regex'

const ForgotPassword = () => {
  // const countryservice = new CountryService();
  const defaultValues = {
    email: '',
  }

  const { control, handleSubmit, reset } = useForm({ defaultValues })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (body) => {
    setLoading(true)
    try {
      await axiosInstant.request({
        method: 'post',
        url: '/api/v1/auth/forgot-password',
        data: body,
      })
      navigate('/otp?email=' + encodeURIComponent(body.email))
    } catch (error) {
    } finally {
      setLoading(false)
    }
    reset()
  }
  const { t } = useTranslation()
  return (
    <AuthLayout showLogo={false}>
      <div className="flex flex-column gap-4">
        <div
          className="border-circle flex justify-content-center align-items-center w-3rem h-3rem bg-gray-200 cursor-pointer"
          onClick={() => navigate('/login')}
        >
          <i className="isax-arrow-left"></i>
        </div>
        <img src="/images/logo.png" alt="logo" width={80} height={80} />
        <div className="text-4xl font-bold">{t('Forgot password')}</div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
          <FormField
            label={t('Email')}
            name={'email'}
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
            control={control}
            render={({ field, fieldState }) => (
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
            )}
          />

          <Button
            type="submit"
            loading={loading}
            label={t('Send Request')}
            icon={'isax-send-2'}
            className="justify-content-center flex mt-6"
          ></Button>
        </form>
      </div>
    </AuthLayout>
  )
}
export default ForgotPassword

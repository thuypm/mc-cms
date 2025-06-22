import axios from 'axios'
import { clsx } from 'clsx'
import FormField from 'components/FormField'
import i18n from 'i18n'
import AuthLayout from 'layouts/AuthLayout'
import { Button } from 'primereact/button'
import { InputOtp } from 'primereact/inputotp'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { REACT_APP_SERVER_API } from 'utils/constants/environment'
import { useObjectSearchParams } from 'utils/hooks/useObjectSearchParams'
const ConfirmOtp = () => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [errorBackend, setErrorBackend] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const defaultValues = {
    email: '',
    otp: '',
  }
  const { control, reset, handleSubmit } = useForm({ defaultValues })
  const navigate = useNavigate()
  const { searchObject } = useObjectSearchParams()

  useEffect(() => {
    if (searchObject?.email)
      reset({ email: decodeURIComponent(searchObject?.email) })
    else navigate('/')
  }, [navigate, reset, searchObject])

  const onSubmit = async (body) => {
    setLoading(true)
    try {
      await axios.request({
        method: 'post',
        baseURL: REACT_APP_SERVER_API,
        headers: {
          'Accept-Language': i18n.language === 'jp' ? 'ja' : 'en',
        },
        url: '/api/v1/auth/forgot-password/verify',
        data: body,
      })
      setIsSuccess(true)
    } catch (error) {
      setErrorBackend(error?.response?.data?.message)
      setIsSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout showLogo={false}>
      {isSuccess ? (
        <>
          <div className="flex flex-column gap-4">
            <div
              className="border-circle flex justify-content-center align-items-center w-3rem h-3rem bg-gray-200 cursor-pointer"
              onClick={() => navigate(-1)}
            >
              <i className="isax-arrow-left"></i>
            </div>
            <img src="/images/logo.png" alt="logo" width={80} height={80} />
            <div>
              <div className="text-4xl font-bold">
                {t('Reset successfully')}
              </div>
              <div className="text-gray-500">
                {t(
                  'Please check your email to get your new password and login again'
                )}
              </div>
            </div>
          </div>

          <Link to={'/login'} className="w-full">
            <Button
              type="submit"
              loading={loading}
              label={t('Login')}
              icon={'isax-login'}
              className="justify-content-center flex w-full"
            ></Button>
          </Link>
        </>
      ) : (
        <>
          <div className="flex flex-column gap-4">
            <div
              className="border-circle flex justify-content-center align-items-center w-3rem h-3rem bg-gray-200 cursor-pointer"
              onClick={() => navigate(-1)}
            >
              <i className="isax-arrow-left"></i>
            </div>
            <img src="/images/logo.png" alt="logo" width={80} height={80} />
            <div>
              <div className="text-4xl font-bold">{t('Confirm otp')}</div>
              <div className="text-gray-500">
                {t('Please check your email to confirm otp')}
              </div>
            </div>
          </div>

          <div className="card">
            <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
              <FormField
                label={t('OTP')}
                name={'otp'}
                rules={{
                  required: t('required', {
                    field: 'OTP',
                  }),
                }}
                control={control}
                render={({ field, fieldState }) => (
                  <InputOtp
                    {...field}
                    length={6}
                    onChange={(e) => field.onChange(e.value)}
                    className={clsx({
                      'p-invalid': fieldState.invalid,
                    })}
                  />
                )}
              />

              <Button
                type="submit"
                loading={loading}
                label={t('Confirm')}
                icon={'isax-send-2'}
                className="justify-content-center flex mt-6"
              ></Button>
              {errorBackend ? (
                <div className="p-error my-1">{errorBackend}</div>
              ) : null}
            </form>
          </div>
        </>
      )}
    </AuthLayout>
  )
}
export default ConfirmOtp

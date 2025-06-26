import axios from 'axios'
import { clsx } from 'clsx'
import FormField from 'components/FormField'
import i18n from 'i18n'
import Cookies from 'js-cookie'
import AuthLayout from 'layouts/AuthLayout'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { REACT_APP_SERVER_API } from 'utils/constants/environment'
import { EMAIL_REGEX } from 'utils/constants/regex'
import { COOKIE_OPTIONS } from 'utils/helper/cookie'
import MicrosoftLoginButton from './MicroSoftLoginBtn'
// import { CountryService } from '../service/CountryService';
// import './FormDemo.css';

const Login = () => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [errorBackend, setErrorBackend] = useState('')
  // const countryservice = new CountryService();
  const defaultValues = {
    email: '',
    password: '',
  }

  const { control, handleSubmit, reset } = useForm({ defaultValues })

  const onSubmit = async (body) => {
    setLoading(true)
    try {
      const { data } = await axios.request({
        method: 'post',
        baseURL: REACT_APP_SERVER_API,
        url: '/api/v1/auth/login',
        headers: {
          'Accept-Language': i18n.language === 'jp' ? 'ja' : 'en',
        },
        data: body,
      })
      Cookies.set('accessToken', data.accessToken, COOKIE_OPTIONS)
      Cookies.set('refreshToken', data.refreshToken, COOKIE_OPTIONS)
      reset()

      if (window.location.pathname.includes('/login'))
        window.location.href = window.location.pathname.replace('login', '')
      else window.location.reload()
    } catch (error) {
      setErrorBackend(error?.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout showLogo>
      <div>
        <div className="flex justify-content-center">
          <img src="logo.png" alt="logo" width={60} />
        </div>
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
                placeholder={t('Email')}
                className={clsx({
                  'p-invalid': fieldState.invalid,
                })}
                maxLength={255}
              />
            )}
          />

          <FormField
            label={t('Password')}
            name="password"
            control={control}
            rules={{
              required: t('required', {
                field: t('Password'),
              }),
            }}
            render={({ field, fieldState }) => (
              <Password
                {...field}
                toggleMask
                placeholder={t('Password')}
                feedback={false}
                className={clsx({
                  'p-invalid': fieldState.invalid,
                })}
                maxLength={50}
              />
            )}
          />

          <Button
            type="submit"
            loading={loading}
            label="Đăng nhập"
            icon={'isax-login'}
            className=" mt-2 "
          ></Button>
          {errorBackend ? (
            <div className="p-error my-1">{errorBackend}</div>
          ) : null}
          <div className="mt-2 flex justify-content-center pt-2">
            <MicrosoftLoginButton />
          </div>
        </form>
      </div>
    </AuthLayout>
  )
}
export default Login

import axios from 'axios'
import clsx from 'clsx'
import FormField from 'components/FormField'
import i18n from 'i18n'
import Cookies from 'js-cookie'
import { observer } from 'mobx-react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Password } from 'primereact/password'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { REACT_APP_SERVER_API } from 'utils/constants/environment'
import { toast } from 'utils/toast'

const ModalmportData = () => {
  const { t } = useTranslation()

  const [showModal, setShowModal] = useState(false)
  const defaultValues = {
    password: '',
    retypePassword: '',
  }
  const [errorBackend, setErrorBackend] = useState('')

  const { control, handleSubmit, reset, watch } = useForm({ defaultValues })
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
      toast({
        severity: 'success',
        detail: t('Change password success'),
        summary: t('Success'),
      })
      setShowModal(false)
    } catch (error) {
      setErrorBackend(error?.response?.data?.message)
    } finally {
      setLoading(false)
    }
    reset()
  }
  return (
    <>
      <Button
        label={t('Change password')}
        outlined
        onClick={() => setShowModal(true)}
      ></Button>
      <Dialog
        onHide={() => {
          setShowModal(false)
        }}
        header={t('Change password')}
        visible={showModal}
        style={{ width: '400px' }}
        contentClassName="flex flex-column gap-4 overflow-auto"
      >
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
                if (watch('password') !== val) {
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
            className="justify-content-center flex"
          ></Button>
          {errorBackend ? (
            <div className="p-error my-1">{errorBackend}</div>
          ) : null}
        </form>
      </Dialog>
    </>
  )
}

export default observer(ModalmportData)

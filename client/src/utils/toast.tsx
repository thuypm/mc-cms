import i18n from 'i18n'
import { Toast } from 'primereact/toast'
import { useCallback, useEffect, useRef } from 'react'

interface ToastProps {
  severity?: string
  summary?: string
  detail?: string
}

export let toast = (_: ToastProps) => {}

export const ToastFC = () => {
  const toastRef = useRef(null)

  const show = useCallback((_: ToastProps) => {
    toastRef.current.show({
      severity: 'error',
      summary: i18n.t('Error'),
      detail: 'Message Content',
      life: 3000,
      ..._,
    })
  }, [])

  useEffect(() => {
    toast = show
  }, [show])

  return <Toast ref={toastRef} />
}

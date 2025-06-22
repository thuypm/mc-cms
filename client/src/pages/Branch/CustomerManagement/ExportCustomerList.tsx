import axiosInstant from 'api/baseRequest'
import { WorkspaceContext } from 'context/workspace.context'
import i18n from 'i18n'
import { observer } from 'mobx-react'
import { Button } from 'primereact/button'
import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'utils/toast'

const ExportCustomerList = () => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  // const {custormerManagementStore:{}}= useStore()
  const {
    user: {
      branch: { name },
    },
  } = useContext(WorkspaceContext)
  const handleExport = async () => {
    try {
      setLoading(true)
      const { data } = await axiosInstant.request({
        url: '/api/v1/customer/export',
        responseType: 'blob',
      })
      const href = URL.createObjectURL(data)

      const link = document.createElement('a')
      link.href = href
      link.download = `${name} - ${i18n.t('Customer list')}.csv`

      link.setAttribute('reservations.xlsx', 'file.xlsx') //or any other extension
      document.body.appendChild(link)
      link.click()

      document.body.removeChild(link)
      URL.revokeObjectURL(href)
    } catch (error) {
      toast({
        severity: 'error',
        detail: t(error?.response?.data?.message),
        summary: t('Error'),
      })
    } finally {
      setLoading(false)
    }
  }
  return (
    <Button
      icon="isax-direct-inbox"
      label={t('Download')}
      // severity="primary"
      // className="btn-pink "
      onClick={handleExport}
      loading={loading}
      outlined
    ></Button>
  )
}
export default observer(ExportCustomerList)

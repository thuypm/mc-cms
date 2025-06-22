import { Button } from 'primereact/button'
import { useTranslation } from 'react-i18next'

import { Link } from 'react-router-dom'

const Forbidden = () => {
  const { t } = useTranslation()
  return (
    <div className="w-screen h-screen flex align-items-center justify-content-center flex-column gap-6">
      <p className="text-2xl font-bold">
        {t('You do not have permission to view this page')}
      </p>

      <Link to={'/'}>
        <Button size="large">{t('Go to home page')}</Button>
      </Link>
    </div>
  )
}

export default Forbidden

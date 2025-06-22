import { Button } from 'primereact/button'
import { useTranslation } from 'react-i18next'

import { Link } from 'react-router-dom'
import { isBranchPage } from 'routers/routes'

const NotFound = () => {
  const { t } = useTranslation()

  return (
    <div className="w-screen h-screen flex align-items-center justify-content-center flex-column gap-6">
      <p className="text-2xl font-bold">{t('Page not found')}</p>
      {isBranchPage ? (
        <div
          onClick={() => {
            window.location.replace('/')
          }}
        >
          <Button size="large">{t('Go to home page')}</Button>
        </div>
      ) : (
        <Link to={'/'}>
          <Button size="large">{t('Go to home page')}</Button>
        </Link>
      )}
    </div>
  )
}

export default NotFound

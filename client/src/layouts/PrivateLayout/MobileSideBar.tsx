import clsx from 'clsx'
import { useStore } from 'context/store'
import { WorkspaceContext } from 'context/workspace.context'
import { observer } from 'mobx-react'
import { Badge } from 'primereact/badge'
import { Button } from 'primereact/button'
import { Menu } from 'primereact/menu'
import { Sidebar } from 'primereact/sidebar'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { getSelectedKey } from 'routers/routes'

function MobileSidebar() {
  const [visible, setVisible] = useState(false)
  const { t } = useTranslation()
  const { i18n } = useTranslation()
  const { appRouters } = useContext(WorkspaceContext)
  const location = useLocation()
  const activeRoutes = getSelectedKey(appRouters, location)

  const {
    contactStore: { hasNewMessages },
  } = useStore()

  useEffect(() => {
    localStorage.setItem('lang', i18n.language)
    document.documentElement.style.setProperty(
      '--font-family',
      i18n.language !== 'jp' ? 'Poppins' : 'Noto Sans'
    )
  }, [i18n.language])

  const itemRenderer = (item) => {
    const isActive = activeRoutes?.map((e) => e.route.key).includes(item.key)
    return (
      <Link className="p-menuitem-content p-menuitem-link" to={item.path}>
        <div className="flex align-items-center p-menuitem-link py-3 relative">
          <i
            className={clsx(
              item.icon,
              'transition-duration-300 text-xl',
              isActive ? 'text-primary font-bold' : ''
            )}
          />

          <span
            className={clsx(
              'mx-2 transition-duration-300',
              isActive ? 'text-primary font-bold' : ''
            )}
          >
            {t(item.label)}
          </span>
          {item.badge && <Badge className="ml-auto" value={item.badge} />}
          {item.shortcut && (
            <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">
              {item.shortcut}
            </span>
          )}
          {item.key === 'contact-management' && hasNewMessages ? (
            <div className="pulse red "></div>
          ) : null}
        </div>
      </Link>
    )
  }

  const items = [
    {
      template: () => (
        <Link
          className="inline-flex align-items-center gap-1 px-4 py-3"
          to={'/'}
        >
          <img width={40} src={'/logo.png'} alt="logo" />
        </Link>
      ),
    },
    ...appRouters
      .filter((e) => !e.hiddenFromMenu)
      .map((route) => ({
        ...route,
        template: itemRenderer,
      })),
  ]

  return (
    <div className="block md:hidden">
      {/* Hamburger button */}
      <Button
        icon="pi pi-bars"
        className="p-button-text"
        onClick={() => setVisible(true)}
      />

      {/* Sidebar overlay */}
      <Sidebar
        visible={visible}
        onHide={() => setVisible(false)}
        dismissable={true}
        className="w-15rem"
      >
        <Menu model={items} className="w-full border-0 border-noround" />
      </Sidebar>
    </div>
  )
}

export default observer(MobileSidebar)

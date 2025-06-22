import clsx from 'clsx'
import { useStore } from 'context/store'
import { WorkspaceContext } from 'context/workspace.context'
import { observer } from 'mobx-react'
import { Badge } from 'primereact/badge'
import { InputSwitch } from 'primereact/inputswitch'
import { Menu } from 'primereact/menu'
import { useContext, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { getSelectedKey } from 'routers/routes'
import {
  REACT_APP_BRANCH_PREFIX,
  REACT_APP_PARENT_APP_DOMAIN,
} from 'utils/constants/environment'

function LeftSideBar({ collapse }) {
  const { t } = useTranslation()

  const { appRouters } = useContext(WorkspaceContext)
  const location = useLocation()
  const activeRoutes = getSelectedKey(appRouters, location)
  const logoSrc = useMemo(() => {
    if (window.location.origin.includes(REACT_APP_BRANCH_PREFIX))
      return '/images/logo-branch.svg'
    else return '/images/logo-app.svg'
  }, [])
  const { i18n } = useTranslation()
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
              ' transition-duration-300 text-xl',
              isActive ? 'text-yellow-500 font-bold' : ''
            )}
          />

          <span
            className={clsx(
              'mx-2  transition-duration-300',
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
  let items = [
    {
      template: () => {
        return (
          <Link
            className="inline-flex align-items-center gap-1 px-4 py-3"
            to={'/'}
          >
            <img src={logoSrc} alt="logo" />
          </Link>
        )
      },
    },
    ...appRouters
      .filter((e) => !e.hiddenFromMenu)
      .map((route) => {
        return {
          ...route,
          template: itemRenderer,
        }
      }),
    // {
    //   template: () => {
    //     return REACT_APP_PARENT_APP_DOMAIN.includes('dev') ? (
    //       <div className="flex gap-2 align-items-center px-4">
    //         English
    //         <InputSwitch
    //           checked={i18n.language !== 'jp'}
    //           onChange={() => {
    //             const lang = i18n.language !== 'jp' ? 'jp' : 'en'
    //             i18n.changeLanguage(lang)
    //             localStorage.setItem('lang', lang)
    //           }}
    //         />
    //       </div>
    //     ) : null
    //   },
    // },
  ]
  return (
    <div
      className={clsx(
        'card flex flex-column h-full justify-content-center transition-duration-300 overflow-hidden flex-nowrap sticky top-0 '
      )}
      style={{
        flex: collapse ? '0 0 0' : '0 0 14rem',
        minHeight: '100vh',
      }}
    >
      <Menu
        model={items}
        className="w-full min-w-min border-0 border-noround flex-1"
      />
      <div className="flex gap-2 align-items-center p-4 bg-white">
        {REACT_APP_PARENT_APP_DOMAIN.includes('dev') ? (
          <>
            English
            <InputSwitch
              checked={i18n.language !== 'jp'}
              onChange={() => {
                const lang = i18n.language !== 'jp' ? 'jp' : 'en'
                i18n.changeLanguage(lang)
              }}
            />
          </>
        ) : null}
      </div>
    </div>
  )
}
export default observer(LeftSideBar)

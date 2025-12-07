import clsx from 'clsx'
import { WorkspaceContext } from 'context/workspace.context'
import { observer } from 'mobx-react'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { getSelectedKey } from 'routers/routes'

function RecursiveMenuItem({
  item,
  activeKeys,
  parentPath,
  t,
  expandedKeys,
  toggleExpand,
}) {
  if (item.hiddenFromMenu) return null

  const isActive = activeKeys.includes(item.key)

  const hasChildren =
    Array.isArray(item.children) && item.children.some((c) => !c.hiddenFromMenu)

  const isExpanded = expandedKeys[item.key] === true

  return (
    <div className="flex flex-column">
      <div
        className={clsx(
          'cursor-pointer',
          hasChildren && 'justify-content-between'
        )}
        onClick={() => {
          if (hasChildren) toggleExpand(item.key)
        }}
      >
        <Link
          className={clsx(
            'flex align-items-center py-3 relative flex-1 gap-2 hover:bg-blue-50 px-4',
            {
              'bg-gray-100': isActive,
            }
          )}
          to={`${parentPath}/${item.path || '#'}`}
          onClick={(e) => {
            // nếu có children thì ngăn redirect
            if (hasChildren) e.preventDefault()
          }}
        >
          <i className={clsx(item.icon, 'transition-duration-300 text-xl')} />

          <span className={clsx('mx-2 transition-duration-300')}>
            {t(item.label)}
          </span>
          {hasChildren && (
            <i
              className={clsx(
                'pi pi-chevron-down transition-transform mr-3',
                isExpanded && 'rotate-180'
              )}
              onClick={(e) => {
                e.stopPropagation()
                toggleExpand(item.key)
              }}
            />
          )}
        </Link>

        {/* Arrow icon */}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="pl-2  surface-border ml-2 animation-duration-200">
          {item.children.map((child) => (
            <RecursiveMenuItem
              key={child.key}
              item={child}
              activeKeys={activeKeys}
              t={t}
              parentPath={item.path}
              expandedKeys={expandedKeys}
              toggleExpand={toggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function LeftSideBar() {
  const { t } = useTranslation()
  const { appRouters } = useContext(WorkspaceContext)

  const location = useLocation()
  const activeRoutes = getSelectedKey(appRouters, location)
  const activeKeys = activeRoutes?.map((e) => e.route.key) || []

  // ========== EXPAND STATE ==========
  const [expandedKeys, setExpandedKeys] = useState({})

  // mở nhánh chứa route đang active
  useEffect(() => {
    let result = {}
    activeKeys.forEach((key) => (result[key] = true))
    setExpandedKeys((prev) => ({ ...prev, ...result }))
  }, [location.pathname])

  const toggleExpand = (key) => {
    setExpandedKeys((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <div
      className={clsx(
        'bg-white flex flex-column h-full transition-duration-300 overflow-hidden sticky top-0 nav-menu'
      )}
      style={{ minHeight: '100vh' }}
    >
      {/* Logo */}
      <div className="inline-flex align-items-center gap-1 px-4 py-3">
        <Link to="/">
          <img width={40} src="/logo.png" alt="logo" />
        </Link>
      </div>

      {/* Recursive menu */}
      <div className=" flex-1 overflow-y-auto">
        {appRouters
          .filter((e) => !e.hiddenFromMenu)
          .map((route) => (
            <RecursiveMenuItem
              key={route.key}
              item={route}
              parentPath={''}
              activeKeys={activeKeys}
              t={t}
              expandedKeys={expandedKeys}
              toggleExpand={toggleExpand}
            />
          ))}
      </div>
    </div>
  )
}

export default observer(LeftSideBar)

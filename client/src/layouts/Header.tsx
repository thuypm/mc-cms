import clsx from 'clsx'
import SelectBranchWorkSpace from 'context/SelectBranchWorkSpace'
import { useStore } from 'context/store'
import { WorkspaceContext } from 'context/workspace.context'
import { t } from 'i18next'
import { Avatar } from 'primereact/avatar'
import { Dialog } from 'primereact/dialog'
import { OverlayPanel } from 'primereact/overlaypanel'
import { Fragment, useContext, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { getSelectedKey } from 'routers/routes'

const BreadCrumb = () => {
  const { appRouters } = useContext(WorkspaceContext)

  const location = useLocation()
  const activeRoutes = getSelectedKey(appRouters, location)

  const routeShowBreaCrumbs = useMemo(() => {
    return activeRoutes?.length
      ? activeRoutes?.filter((e) => !e.route.hiddenFromBreadCrumb)
      : []
  }, [activeRoutes])

  return (
    <div className="flex overflow-hidden align-items-center flex-1">
      {routeShowBreaCrumbs.map((route, id) => (
        <Fragment key={route.route.key}>
          <Link
            className={clsx(
              'text-gray-600 no-underline white-space-nowrap ',
              id === routeShowBreaCrumbs.length - 1 ? '  font-medium' : ''
            )}
            to={route.pathnameBase}
          >
            {t(route.route.label)}
            {id < routeShowBreaCrumbs.length - 1 ? (
              <span>&nbsp; / &nbsp;</span>
            ) : null}
          </Link>
        </Fragment>
      ))}
    </div>
  )
}
export default function Header({ setCollapse }: any) {
  const { t } = useTranslation()
  const { user } = useContext(WorkspaceContext)
  const op = useRef(null)
  const {
    authStore: { logout },
  } = useStore()
  const [show, setShow] = useState(false)

  return (
    <div className=" flex justify-content-between align-items-center py-3 sticky top-0 z-5 bg-gray-100 mb-4">
      <div className="flex  align-items-center gap-2 flex-1 overflow-hidden">
        <div
          className="cursor-pointer p-2 flex  align-items-center"
          onClick={() => setCollapse((collapse) => !collapse)}
        >
          <i className="isax-menu-1"></i>
        </div>
        <BreadCrumb />
      </div>
      <div
        className="flex gap-2 align-items-center cursor-pointer"
        onClick={(e) => op.current.toggle(e)}
      >
        <Avatar
          className="bg-light-primary text-white opacity-1"
          label={user.fullName.slice(0, 1)}
          size="large"
          shape="circle"
        />
        <div>
          <p
            className="m-0 font-bold overflow-hidden text-overflow-ellipsis white-space-nowrap"
            style={{
              maxWidth: '15rem',
            }}
          ></p>
          <p className="m-0 text-sm">{user.email}</p>
        </div>
        <i className="isax-arrow-down-small-bold"></i>
      </div>
      <Dialog visible={show} onHide={() => setShow(false)}>
        <SelectBranchWorkSpace className=" " showLogo={false} />
      </Dialog>
      <OverlayPanel ref={op}>
        <div className="flex flex-column gap-2">
          <Link
            to={'/profile'}
            className="p-menuitem-content hover:surface-50 px-3 py-2 cursor-pointer text-gray-600"
          >
            <div className="flex align-items-center p-menuitem-link">
              <i className="isax-profile-circle"></i>
              <span className="mx-2">{t('Profile')}</span>
            </div>
          </Link>

          <div
            className="p-menuitem-content hover:surface-50 px-3 py-2 cursor-pointer"
            onClick={logout}
          >
            <div className="flex align-items-center p-menuitem-link">
              <i className="isax-logout"></i>
              <span className="mx-2">{t('Sign out')}</span>
            </div>
          </div>
        </div>
      </OverlayPanel>
    </div>
  )
}

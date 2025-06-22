import { useStore } from 'context/store'
import { WorkspaceContext } from 'context/workspace.context'
import Header from 'layouts/Header'
import { observer } from 'mobx-react'
import ForceChangePassword from 'pages/Auth/ForceChangePassword'
import Login from 'pages/Auth/Login'
import NotFound from 'pages/Error/404'
import {
  Dispatch,
  Fragment,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Route, Routes } from 'react-router-dom'
import { IMenuItem, isBranchPage, isHeadquarterPage } from 'routers/routes'
import { REACT_APP_BRANCH_PAGE } from 'utils/constants/environment'
import { UserRoleEnum, UserStatusEnum } from 'utils/constants/user'
import LeftSideBar from './LeftSideBar'
const getRouteComponent = (
  route: IMenuItem,
  menuRole?: any,
  setCollapse?: Dispatch<SetStateAction<boolean>>
) => {
  return route.children ? (
    <Fragment key={route.key}>
      <Route
        key={route.key}
        path={route.path}
        element={
          <>
            <Header setCollapse={setCollapse} />
            {route.element}
          </>
        }
        index
      ></Route>
      <Route key={route.key} path={route.path}>
        {route.children?.length ? (
          route.children.map((child) =>
            getRouteComponent(child, menuRole, setCollapse)
          )
        ) : (
          <>
            <Header setCollapse={setCollapse} />
            {route.element}
          </>
        )}
      </Route>
      <Route path="*" element={<NotFound />}></Route>
    </Fragment>
  ) : (
    <Route
      key={route.key}
      path={route.path}
      element={
        <>
          <Header setCollapse={setCollapse} />
          {route.element}
        </>
      }
      index
    ></Route>
  )
}

const PrivateLayoutContent = () => {
  const {
    user: { role },
    appRouters,
  } = useContext(WorkspaceContext)
  const {
    contactStore: { getNewNotifMessage },
  } = useStore()

  const intervalRef = useRef(null)
  useEffect(() => {
    getNewNotifMessage()
    intervalRef.current = setInterval(getNewNotifMessage, 30000)

    return () => {
      clearInterval(intervalRef.current)
    }
  }, [getNewNotifMessage])
  const [collapse, setCollapse] = useState(false)
  const hasPermissionWithDomain = useMemo(() => {
    switch (role) {
      case UserRoleEnum.BranchAdmin:
        return isBranchPage
      case UserRoleEnum.Headquarter:
        return isBranchPage || isHeadquarterPage

      default:
        return false
    }
  }, [role])

  if (!hasPermissionWithDomain)
    window.location.href = `${REACT_APP_BRANCH_PAGE}`
  else
    return (
      <div className="w-full h-full flex bg-gray-100 gap-3">
        <LeftSideBar collapse={collapse} />
        <div className="flex-1 pr-3 overflow-hidden">
          <Routes>
            {appRouters.map((route) =>
              getRouteComponent(route, role, setCollapse)
            )}
          </Routes>
        </div>
      </div>
    )
}

const PrivateLayout = () => {
  const { user } = useContext(WorkspaceContext)

  if (user)
    return user.status === UserStatusEnum.Pending ? (
      <ForceChangePassword />
    ) : (
      <PrivateLayoutContent />
    )
  else return <Login />
}

export default observer(PrivateLayout)

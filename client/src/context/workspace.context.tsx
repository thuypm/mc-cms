import {
  BackendConfigConstant,
  BackendEnumConstant,
  BackendOptionConstant,
} from 'Base'
import { UserSyncData } from 'Models'
import { setCustomHeaders } from 'api/baseRequest'

import { Button } from 'primereact/button'
import { ProgressSpinner } from 'primereact/progressspinner'
import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IMenuItem, getAppRouteByRole, isBranchPage } from 'routers/routes'
import { UserRoleEnum } from 'utils/constants/user'
import SelectBranchWorkSpace from './SelectBranchWorkSpace'
import { useStore } from './store'
import { useTranslation } from 'react-i18next'

interface IWorkspaceContext {
  loadingPermission?: boolean
  workspaceProject?: any
  user?: UserSyncData
  backendEnumContant?: BackendEnumConstant
  logout?: () => void
  backendConfigConstant?: BackendConfigConstant
  appRouters?: IMenuItem[]
  hotReloadNewConfig?: () => void
  fetchUser?: () => void
  backendOptionsConstant?: BackendOptionConstant
}

interface WorkspaceContextProviderProps extends IWorkspaceContext {
  children: React.ReactNode
}

export const WorkspaceContext = createContext<IWorkspaceContext>({
  loadingPermission: false,
  workspaceProject: null,
})

export function WorkspaceContextProvider(
  props: WorkspaceContextProviderProps
): JSX.Element {
  const [user, setUser] = useState<UserSyncData>(null)
  const [appRouters, setAppRouters] = useState<IMenuItem[]>(null)
  const {
    authStore: { refreshToken, startSync, fetchUser: getUser },
  } = useStore()

  const [notFoundBranch, setNotFoundBranch] = useState(false)
  const navigate = useNavigate()

  const branchId = useMemo(() => {
    const matches = window.location.pathname.split('/')
    return matches?.[1]
  }, [])

  const { t } = useTranslation()
  const [loadingPermission, setLoadingPermission] = useState(true)

  const fetchUser = useCallback(async () => {
    setLoadingPermission(true)
    setNotFoundBranch(false)
    try {
      await refreshToken()
      startSync()

      if (branchId && isBranchPage)
        setCustomHeaders({
          'x-branch-id': branchId,
        })
      const data = await getUser()
      setUser(data)

      if (isBranchPage) {
        if (
          (!branchId && data.branch?._id) ||
          (data.branch?._id && branchId !== data.branch?._id)
        )
          window.location.replace(`/${data.branch?._id}`)
        if (branchId && !data.branch?._id) setNotFoundBranch(true)
      }

      setAppRouters(getAppRouteByRole())
    } catch (error) {
      console.log(error)
      if (isBranchPage) setNotFoundBranch(true)
      // throw error
    } finally {
      setLoadingPermission(false)
    }
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId, getUser, navigate, refreshToken, startSync])

  useEffect(() => {
    fetchUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <WorkspaceContext.Provider
      value={{
        user,
        appRouters,
        // loadingPermission,
        fetchUser,
      }}
    >
      {loadingPermission ? (
        <div className="w-full h-screen overflow-hidden flex align-items-center justify-content-center ">
          <ProgressSpinner strokeWidth="4" animationDuration=".5s" />
        </div>
      ) : !branchId &&
        isBranchPage &&
        user?.role === UserRoleEnum.Headquarter ? (
        <div className="w-full h-screen flex justify-content-center align-items-center border bg-gray-100">
          {<SelectBranchWorkSpace className="py-4" />}
        </div>
      ) : user && notFoundBranch ? (
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
      ) : (
        props.children
      )}
    </WorkspaceContext.Provider>
  )
}

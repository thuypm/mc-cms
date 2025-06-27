import {
  BackendConfigConstant,
  BackendEnumConstant,
  BackendOptionConstant,
} from 'Base'
import { UserSyncData } from 'Models'

import { ProgressSpinner } from 'primereact/progressspinner'
import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { IMenuItem } from 'routers/routes'
import { useStore } from './store'

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
  const [loadingPermission, setLoadingPermission] = useState(false)

  const fetchUser = useCallback(async () => {
    // setLoadingPermission(true)
    setNotFoundBranch(false)

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
      ) : (
        props.children
      )}
    </WorkspaceContext.Provider>
  )
}

import {
  BackendConfigConstant,
  BackendEnumConstant,
  BackendOptionConstant,
} from 'Base'
import { UserSyncData } from 'Models'

import axios from 'axios'
import { ProgressSpinner } from 'primereact/progressspinner'
import { createContext, useCallback, useEffect, useState } from 'react'
import { branchRouters } from 'routers/defaultRouter'
import { IMenuItem } from 'routers/routes'
import { REACT_APP_SERVER_API } from 'utils/constants/environment'
import SelectBranchWorkSpace from './SelectBranchWorkSpace'

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

  const [loadingPermission, setLoadingPermission] = useState(false)

  const fetchUser = useCallback(async () => {
    setLoadingPermission(true)
    const token = localStorage.getItem('accessToken')
    try {
      const { data } = await axios.request({
        baseURL: REACT_APP_SERVER_API,
        method: 'GET',
        url: '/api/auth/me',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setUser(data)
      setAppRouters(branchRouters)
    } catch (error) {
    } finally {
      setLoadingPermission(false)
    }
  }, [])

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
      ) : localStorage.getItem('branchId') ? (
        props.children
      ) : (
        <SelectBranchWorkSpace />
      )}
    </WorkspaceContext.Provider>
  )
}

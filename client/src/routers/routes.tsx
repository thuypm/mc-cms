import { ReactNode } from 'react'
import { Location, matchRoutes } from 'react-router-dom'

// Position
import ConfirmOtp from 'pages/Auth/ConfirmOtp'
import ForgotPassword from 'pages/Auth/ForgotPassword'
import LoginPage from 'pages/Auth/Login'
import Forbidden from 'pages/Error/403'
import NotFound from 'pages/Error/404'
import {
  REACT_APP_BRANCH_PREFIX,
  REACT_APP_HEAD_QUATER_PREFIX,
} from 'utils/constants/environment'
import { branchAdminRouter } from './branchRoutes'
import { headQuarterRouters } from './headquarterRoutes'

export interface IMenuItem {
  key: string
  path: string
  element?: ReactNode
  label: string
  hiddenFromMenu?: boolean
  hiddenFromBreadCrumb?: boolean
  icon?: ReactNode
  isLink?: boolean
  nested?: boolean
  index?: boolean
  permissionModule?: string | string[]
  actionPermission?: string | string[]
  children?: Array<IMenuItem>
}

export const publicRoutes = [
  {
    key: 'not-found',
    path: '404',
    element: <NotFound />,
    label: 'Không tìm thấy trang',
    icon: <></>,
  },
  {
    key: 'forbidden',
    path: '/403',
    element: <Forbidden />,
    label: 'Không tìm thấy trang',
    icon: <></>,
  },
  {
    key: 'login',
    path: '/login',
    element: <LoginPage />,
    label: 'Đăng nhập',
    icon: <></>,
  },
  {
    key: 'forgot-password',
    path: '/forgot-password',
    element: <ForgotPassword />,
    label: 'Đăng nhập',
    icon: <></>,
  },
  {
    key: 'otp',
    path: '/otp',
    element: <ConfirmOtp />,
    label: 'Input otp',
    icon: <></>,
  },
]

export const getAppRouteByRole = () => {
  if (isBranchPage) return branchAdminRouter
  if (isHeadquarterPage) return headQuarterRouters
}

export const getSelectedKey = (
  routes: Array<any>,
  location: Location,
  baseName?: string
): {
  params: any
  pathname: string
  pathnameBase: string
  route: IMenuItem
}[] => {
  const matchRts = matchRoutes(routes, location, baseName)
  return matchRts ?? []
}
export const isBranchPage = window.location.origin.includes(
  REACT_APP_BRANCH_PREFIX
)
export const isHeadquarterPage = window.location.origin.includes(
  REACT_APP_HEAD_QUATER_PREFIX
)

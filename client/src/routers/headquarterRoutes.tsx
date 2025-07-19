import Profile from 'pages/Profile'
import { Navigate } from 'react-router-dom'
import { IMenuItem } from './routes'

export const headQuarterRouters: Array<IMenuItem> = [
  {
    key: 'BranchManagement',
    path: '/',
    element: <Navigate to="/admin-management" />,
    label: 'BranchManagement',
    hiddenFromMenu: true,
    icon: '',
  },
  {
    key: 'profile',
    path: '/profile',
    element: <Profile />,
    label: 'Profile',
    hiddenFromMenu: true,
    icon: '',
  },
]

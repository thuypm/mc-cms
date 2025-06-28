import AdminManagement from 'pages/HeadQuarter/AdminManagement'
import AdminDetailPage from 'pages/HeadQuarter/AdminManagement/AdminDetailPage'
import CreateAdminManagement from 'pages/HeadQuarter/AdminManagement/CreateAdminManagement'
import EditAdmin from 'pages/HeadQuarter/AdminManagement/EditAdmin'
import BranchManagement from 'pages/HeadQuarter/BranchManagement'
import BranchDetailPage from 'pages/HeadQuarter/BranchManagement/BranchDetailPage'
import CreateBranchPage from 'pages/HeadQuarter/BranchManagement/CreateBranchPage'
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
  {
    key: 'branch-management',
    path: '/branch-management',

    element: <BranchManagement />,
    label: 'Branch management',
    hiddenFromMenu: false,
    icon: 'isax isax-hierarchy',
    children: [
      {
        key: 'create-branch',
        path: 'create',
        element: <CreateBranchPage />,
        label: 'Create Branch',
        hiddenFromMenu: true,
        icon: '',
      },
      {
        key: 'detail-edit',
        path: ':id',
        element: <BranchDetailPage />,
        label: 'Detail Branch',
        hiddenFromMenu: true,
        icon: '',
        children: [
          {
            key: 'edit-admin',
            path: 'edit',
            element: <CreateBranchPage />,
            label: 'Edit Branch',
            hiddenFromMenu: true,
            icon: '',
          },
          {
            key: 'detail-admin',
            path: 'view',
            element: <BranchDetailPage />,
            label: 'Detail Branch',
            hiddenFromMenu: true,
            icon: '',
          },
        ],
      },
    ],
  },
  {
    key: 'admin-management',
    path: '/admin-management',
    element: <AdminManagement />,
    label: 'Admin management',
    hiddenFromMenu: false,
    icon: 'isax isax-security-user',
    children: [
      {
        key: 'create-admin',
        path: 'create',
        element: <CreateAdminManagement />,
        label: 'Invite New Admin',
        hiddenFromMenu: true,
        icon: '',
      },
      {
        key: 'detail-edit',
        path: ':id',
        element: <AdminDetailPage />,
        label: 'Detail Admin',
        hiddenFromMenu: true,
        icon: '',
        children: [
          {
            key: 'edit-admin',
            path: 'edit',
            element: <EditAdmin />,
            label: 'Edit Admin',
            hiddenFromMenu: true,
            icon: '',
          },
          {
            key: 'detail-admin',
            path: 'view',
            element: <AdminDetailPage />,
            label: 'Detail Admin',
            hiddenFromMenu: true,
            icon: '',
          },
        ],
      },
    ],
  },
]

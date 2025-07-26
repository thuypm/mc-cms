import StudentManagement from 'pages/Branch/StudentManagement'
import CreateCustomer from 'pages/Branch/StudentManagement/CreateCustomer'
import CustomerDetailPage from 'pages/Branch/StudentManagement/CustomerDetailPage'

import DayBoarding from 'pages/Branch/DayBoarding'
import CreateDayBoarding from 'pages/Branch/DayBoarding/CreateDayBoarding'
import Profile from 'pages/Profile'
import { Navigate } from 'react-router-dom'
import { IMenuItem } from './routes'

export const branchRouters: Array<IMenuItem> = [
  {
    key: 'BranchManagement',
    path: '/',
    element: <Navigate to={'/day-boarding'} />,
    label: 'Home',
    hiddenFromMenu: true,
    icon: 'pi-warehouse pi',
  },
  {
    key: 'profile',
    path: '/profile',
    element: <Profile />,
    label: 'Profile',
    hiddenFromMenu: true,
    icon: 'mdi mdi-domain',
  },

  {
    key: 'day-boarding',
    path: '/day-boarding',
    element: <DayBoarding />,
    label: 'Quản lý bán trú',
    hiddenFromMenu: false,
    icon: 'pi-warehouse pi',
    children: [
      {
        key: 'create-enewletter',
        path: 'create',
        element: <CreateDayBoarding />,
        label: 'Create E-Newsletter',
        hiddenFromMenu: true,
        icon: '',
      },
    ],
  },

  {
    key: 'student-management',
    path: '/student-management',
    element: <StudentManagement />,
    label: 'Danh sách học sinh',
    hiddenFromMenu: false,
    icon: 'pi pi-user',
    children: [
      {
        key: 'create-student',
        path: 'create',
        element: <CreateCustomer />,
        label: 'Create Customer',
        hiddenFromMenu: true,
        icon: '',
      },
      {
        key: 'detail-view',
        path: ':id',
        element: <CustomerDetailPage />,
        label: 'Detail Customer',
        hiddenFromMenu: true,
        hiddenFromBreadCrumb: false,
        icon: '',
        children: [
          {
            key: 'customer-edit',
            path: 'edit',
            element: <CreateCustomer />,
            label: 'Edit Customer',
            hiddenFromMenu: false,
            icon: 'pi-users pi',
          },
        ],
      },
    ],
  },
]

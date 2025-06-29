import CustomerManagement from 'pages/Branch/CustomerManagement'
import CreateCustomer from 'pages/Branch/CustomerManagement/CreateCustomer'
import CustomerDetailPage from 'pages/Branch/CustomerManagement/CustomerDetailPage'
import EmailTemplate from 'pages/Branch/EmailTemplate'
import EditEmaiTemplate from 'pages/Branch/EmailTemplate/EditEmaiTemplate'

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
    key: 'customer-management',
    path: '/customer-management',
    element: <CustomerManagement />,
    label: 'Customer management',
    hiddenFromMenu: false,
    icon: ' isax-profile-2user',
    children: [
      {
        key: 'create-customer',
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

  {
    key: 'email-template',
    path: '/email-template',
    element: <EmailTemplate />,
    label: 'Email Template  Management',
    hiddenFromMenu: false,
    icon: 'isax-sms',
    children: [
      {
        key: 'email-template-edit',
        path: ':id/edit',
        element: <EditEmaiTemplate />,
        label: 'Email template edit',
        hiddenFromMenu: false,
        icon: 'pi-users pi',
      },
    ],
  },
]

import EmailTemplate from 'pages/Branch/EmailTemplate'
import EditEmaiTemplate from 'pages/Branch/EmailTemplate/EditEmaiTemplate'
import EventManagement from 'pages/Branch/EventManagement'
import CreateEvent from 'pages/Branch/EventManagement/CreateEvent'
import EventDetailPage from 'pages/Branch/EventManagement/EventDetailPage'
import RegistrationList from 'pages/Branch/EventManagement/RegistrationList'
import EditRegistration from 'pages/Branch/EventManagement/RegistrationList/EditRegistration'
import RegistrationDetail from 'pages/Branch/EventManagement/RegistrationList/RegistrationDetail'
import { Navigate } from 'react-router-dom'
import { IMenuItem } from './routes'
import CustomerManagement from 'pages/Branch/CustomerManagement'
import CreateCustomer from 'pages/Branch/CustomerManagement/CreateCustomer'
import CustomerDetailPage from 'pages/Branch/CustomerManagement/CustomerDetailPage'
import ENewletterManagament from 'pages/Branch/ENewletterManagament'
import CreateEnewLetter from 'pages/Branch/ENewletterManagament/CreateEnewLetter'
import EnewLetterDetailPage from 'pages/Branch/ENewletterManagament/EnewLetterDetailPage'
import Profile from 'pages/Profile'
import ContactManagement from 'pages/ContactManagement'
import CreateContactPage from 'pages/ContactManagement/CreateContactPage'
import DetailContactPage from 'pages/ContactManagement/DetailContactPage'

export const branchAdminRouter: Array<IMenuItem> = [
  {
    key: 'BranchManagement',
    path: '/',
    element: <Navigate to={'/event-management'} />,
    label: 'Home',
    hiddenFromMenu: true,
    icon: 'mdi mdi-domain',
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
    key: 'event-management',
    path: '/event-management',
    element: <EventManagement />,
    label: 'Event management',
    hiddenFromMenu: false,
    icon: 'isax isax-calendar-1',
    children: [
      {
        key: 'create-event',
        path: 'create',
        element: <CreateEvent />,
        label: 'Create Event',
        hiddenFromMenu: true,
        icon: '',
      },
      {
        key: 'detail-view',
        path: ':id',
        element: <EventDetailPage />,
        label: 'Detail Event',
        hiddenFromMenu: true,
        hiddenFromBreadCrumb: false,
        icon: '',
        children: [
          {
            key: 'edit-event',
            path: 'edit',
            element: <CreateEvent />,
            label: 'Edit event',
            hiddenFromMenu: false,
            icon: '',
          },
          {
            key: 'registration-event',
            path: 'registration',
            element: <RegistrationList />,
            label: 'Registrations List',
            hiddenFromMenu: false,
            icon: '',
            children: [
              {
                key: 'detail-registration',
                path: ':registrationId',
                element: <RegistrationDetail />,
                label: 'Registrations details',
                hiddenFromMenu: true,
                icon: '',
                children: [
                  {
                    key: 'registration-view',
                    path: 'edit',
                    element: <EditRegistration />,
                    label: 'Edit Registration',
                    hiddenFromMenu: true,
                  },
                ],
              },
            ],
          },
          {
            key: 'detail-event',
            path: 'view',
            element: <EventDetailPage />,
            label: 'Detail Event',
            hiddenFromMenu: true,
            icon: '',
          },
        ],
      },
    ],
  },
  {
    key: 'enewletter-management',
    path: '/enewletter-management',
    element: <ENewletterManagament />,
    label: 'E-Newsletter management',
    hiddenFromMenu: false,
    icon: 'isax-device-message',
    children: [
      {
        key: 'create-enewletter',
        path: 'create',
        element: <CreateEnewLetter />,
        label: 'Create E-Newsletter',
        hiddenFromMenu: true,
        icon: '',
      },
      {
        key: 'detail-view',
        path: ':id',
        element: <EnewLetterDetailPage />,
        label: 'Detail E-Newsletter',
        hiddenFromMenu: true,
        hiddenFromBreadCrumb: false,
        icon: '',
        children: [
          {
            key: 'enews-edit',
            path: 'edit',
            element: <CreateEnewLetter />,
            label: 'Edit E-Newsletter',
            hiddenFromMenu: false,
            icon: 'pi-users pi',
          },
        ],
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
    key: 'contact-management',
    path: '/contact-management',
    element: <ContactManagement />,
    label: 'Contact management',
    hiddenFromMenu: false,
    icon: 'isax-messages',
    children: [
      {
        key: 'create-contact',
        path: 'create',
        element: <CreateContactPage />,
        label: 'Create Thread',
        hiddenFromMenu: true,
        icon: '',
      },
      {
        key: 'detail-edit',
        path: ':id',
        element: <DetailContactPage />,
        label: 'Detail Thread',
        hiddenFromMenu: true,
        icon: '',
        children: [
          {
            key: 'edit-admin',
            path: 'edit',
            element: <CreateContactPage />,
            label: 'Edit Thread',
            hiddenFromMenu: true,
            icon: '',
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

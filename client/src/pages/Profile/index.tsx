// import { CountryService } from '../service/CountryService';
// import './FormDemo.css';

import { WorkspaceContext } from 'context/workspace.context'
import { useContext } from 'react'

const Profile = () => {
  const { user } = useContext(WorkspaceContext)

  return (
    <div className="card bg-white border-round-xl px-3 py-5 ">
      {/* <div className="flex gap-2 align-items-center cursor-pointer">
        <Avatar
          className="bg-light-primary text-white opacity-1"
          label={user.fullName.slice(0, 1)}
          size="large"
          shape="circle"
        />
        <div>
          <p className="m-0 font-bold overflow-hidden text-overflow-ellipsis white-space-nowrap"></p>
          <p className="m-0 text-sm">{user.email}</p>
        </div>
      </div>
      <Divider />
      <div className="px-2 mt-4">
        <FieldDetail
          label={t('Branch')}
          value={user.branch?.name ?? t('Headquarter')}
        ></FieldDetail>
        <FieldDetail label={t('Name')} value={user.fullName}></FieldDetail>
        <FieldDetail label={t('Email')} value={user.email}></FieldDetail>

        <FieldDetail
          label={t('Phone Number')}
          value={formatPhone(user.phoneNumber)}
        ></FieldDetail>

        <FieldDetail label={t('Note')} value={user.note}></FieldDetail>
      </div>
      <Divider />
      <div className="mt-4 flex gap-2">
        <EditProfile />
        <ModalChangePassword />
      </div> */}
    </div>
  )
}
export default Profile

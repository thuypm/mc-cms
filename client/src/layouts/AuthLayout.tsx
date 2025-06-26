import { ReactNode } from 'react'
// import { CountryService } from '../service/CountryService';
// import './FormDemo.css';

const AuthLayout = ({
  children,
  showLogo,
}: {
  children?: ReactNode
  showLogo?: boolean
}) => {
  return (
    <div className="flex w-full h-screen">
      <div
        className="p-5 flex m-auto "
        style={{ maxWidth: 1440, maxHeight: 800, gap: '192px' }}
      >
        <div className="flex flex-column justify-content-center h-full gap-6  bg-white p-4">
          {children}
        </div>
      </div>
    </div>
  )
}
export default AuthLayout

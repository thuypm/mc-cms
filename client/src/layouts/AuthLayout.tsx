import clsx from 'clsx'
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
    <div className="flex w-full h-screen  ">
      <div
        className="p-5 flex m-auto h-full "
        style={{ maxWidth: 1440, maxHeight: 800, gap: '192px' }}
      >
        <div className="h-full flex align-items-center justify-content-center px-8">
          <img
            src="/images/logo-text.svg"
            alt=""
            width={224}
            height={224}
            className={clsx(
              'object-cover',
              showLogo ? 'opacity-100' : 'opacity-0'
            )}
          />
        </div>

        <div className="flex flex-column justify-content-center  h-full gap-6 w-24rem">
          {children}
        </div>
      </div>
    </div>
  )
}
export default AuthLayout

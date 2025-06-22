import clsx from 'clsx'
import { ReactNode } from 'react'

const Chip = ({
  children,
  className,
  style,
}: {
  children?: ReactNode
  className?: string
  style?: any
}) => {
  return (
    <div
      className={clsx(
        'text-sm px-2 py-1 border-1 border-gray-300 border-round  bg-gray-50',
        className
      )}
      style={style}
    >
      {children}
    </div>
  )
}

export default Chip

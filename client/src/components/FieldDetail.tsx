import clsx from 'clsx'
import { ReactNode } from 'react'

interface FieldDetailProps {
  label?: ReactNode
  value?: ReactNode
  className?: string
  hiddenWhenEmpty?: boolean
  btnExpand?: ReactNode
}

export default function FieldDetail({
  label,
  btnExpand,
  value,
  hiddenWhenEmpty = true,
  className,
}: FieldDetailProps) {
  return hiddenWhenEmpty && value === undefined ? null : (
    <div className={clsx(' flex gap-4', className ? className : 'mb-3')}>
      <div className="text-gray-900 font-medium w-12rem ">
        {label}
        {btnExpand}
      </div>
      <div
        className=" flex-1 overflow-hidden "
        style={{
          whiteSpace: 'pre-wrap',
        }}
      >
        {value}
      </div>
    </div>
  )
}

import clsx from 'clsx'
import { observer } from 'mobx-react'
import { CSSProperties, ReactNode } from 'react'

const CardChart = ({
  children,
  title,
  className,
  style,
}: {
  children?: ReactNode
  title?: ReactNode
  className?: string
  style?: CSSProperties
}) => {
  return (
    <div
      style={{
        boxShadow: '0px 4px 30px 0px #DDE0FF8A',
        ...style,
      }}
      className={clsx('p-card p-component ', className ? className : '')}
    >
      <div className="p-card-body">
        <div className="p-card-title text-center">{title}</div>
        <div className="p-card-content">{children}</div>
      </div>
    </div>
  )
}

export default observer(CardChart)

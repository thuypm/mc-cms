import { clsx } from 'clsx'

const LoadingDot = ({ className }: { className?: string }) => {
  return (
    <div className={clsx('loading', className)}>
      <span className="loading__dot"></span>
      <span className="loading__dot"></span>
      <span className="loading__dot"></span>
    </div>
  )
}
export default LoadingDot

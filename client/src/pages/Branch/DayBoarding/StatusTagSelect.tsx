import clsx from 'clsx'

const StatusTagSelect = ({
  status,
  onChange,
  disabled,
}: {
  status?: number
  onChange?: (value: number) => void
  disabled?: boolean
}) => {
  return (
    <div className={clsx('my-2 flex gap-2')}>
      <div
        className={clsx(
          ' px-2 border-round py-1 flex items-center gap-2 border border-1 border-gray-300',
          status > 0 ? 'bg-green-100 text-green-800' : '',
          disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer '
        )}
        onClick={
          disabled ? null : () => onChange && onChange(status > 0 ? 0 : 1)
        }
      >
        <i className="pi pi-check"></i>
      </div>
      <div
        className={clsx(
          ' px-2 border-round py-1 flex items-center gap-2 border border-1 border-gray-300',
          status < 0 ? 'bg-red-100 text-red-800' : '',
          disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer '
        )}
        onClick={
          disabled ? null : () => onChange && onChange(status < 0 ? 0 : -1)
        }
      >
        <i className="pi pi-times"></i>
      </div>
    </div>
  )
}

export default StatusTagSelect

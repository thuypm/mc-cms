import clsx from 'clsx'

const Radio = (props: {
  checked?: boolean
  onChange?: (value: boolean) => void
}) => {
  const { checked, onChange } = props
  return (
    <div
      className={clsx('meey-radio', checked ? 'active' : '')}
      onClick={() => {
        onChange && onChange(!checked)
      }}
    ></div>
  )
}

export default Radio

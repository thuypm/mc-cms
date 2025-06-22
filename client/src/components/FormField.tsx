import clsx from 'clsx'
import { ReactNode } from 'react'
import { Controller, ControllerProps } from 'react-hook-form'

interface FormFieldProps extends ControllerProps<any, any> {
  label?: ReactNode
  className?: string
  labelClassName?: string
  required?: boolean
  name: string
}
export default function FormField(props: FormFieldProps) {
  const { label, name, className, labelClassName, required, ...rest } = props
  return (
    <div className={clsx('field', className)}>
      <label htmlFor="name" className={clsx(labelClassName ?? 'font-semibold')}>
        {label}{' '}
        {props.rules?.required || required ? (
          <span className="text-red-500">*</span>
        ) : null}
      </label>
      <Controller
        name={name}
        {...rest}
        render={(fieldProps) => {
          return (
            <>
              {props.render(fieldProps)}
              {fieldProps.fieldState.error ? (
                <small className="p-error w">
                  {fieldProps.fieldState.error.message}
                </small>
              ) : null}
            </>
          )
        }}
      />
    </div>
  )
}

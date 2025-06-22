import React, { useState, forwardRef, useEffect } from 'react'

interface InputNumberProps {
  disabled?: boolean
  placeholder?: string
  className?: string
  min?: number
  maxLength?: number
  value?: number | null
  style?: React.CSSProperties
  onChange?: (event: { value: number | null }) => void
}

const InputNumberCustom = forwardRef<HTMLInputElement, InputNumberProps>(
  (
    {
      disabled = false,
      placeholder = '',
      className = '',
      min = 0,
      maxLength,
      value = null,
      style = {},
      onChange,
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState<string>(
      value !== null ? String(value) : ''
    )

    useEffect(() => {
      setInputValue(value !== null ? String(value) : '')
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value

      if (/^\d*$/.test(newValue)) {
        const parsedValue = newValue === '' ? null : parseFloat(newValue)

        setInputValue(newValue)
        onChange && onChange({ value: parsedValue })
      }
    }

    return (
      <input
        type="text"
        ref={ref}
        disabled={disabled}
        placeholder={placeholder}
        value={inputValue}
        min={min}
        max={maxLength}
        onChange={handleChange}
        className={`p-inputtext ${className} ${disabled ? 'p-disabled' : ''}`}
        style={style}
      />
    )
  }
)

export default InputNumberCustom

import React, { FC, SelectHTMLAttributes } from 'react'
import classNames from 'classnames'

export interface SelectOption {
  value: string | number
  label: string
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string
  label: string
  options: SelectOption[]
  placeholder?: string
}

const Select: FC<SelectProps> = (props) => {
   const { id, label, options, placeholder, className, ...rest } = props

  const componentsClass = 'a_Select'

  return (
    <div className={classNames(componentsClass, className)}>
      <label className={`${componentsClass}_label`} htmlFor={id}>
        {label}
      </label>
      <select id={id} className={`${componentsClass}_select`} {...rest}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} className={`${componentsClass}_option`}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Select
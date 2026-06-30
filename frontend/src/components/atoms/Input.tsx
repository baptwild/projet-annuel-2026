import React, { FC, InputHTMLAttributes } from 'react'
import classNames from 'classnames'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
}

const Input: FC<InputProps> = (props) => {
   const { id, label, className, ...rest } = props
   
   const componentsClass = 'a_Input'

  return (
    <div className={classNames(componentsClass, className)}>
      <label className={`${componentsClass}_label`} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={`${componentsClass}_input`}
        {...rest}
      />
    </div>
  )
}

export default Input
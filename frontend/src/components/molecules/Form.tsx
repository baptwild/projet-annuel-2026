import React, { FC, FormHTMLAttributes, ReactNode } from 'react'
import classNames from 'classnames'

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode
}

const Form: FC<FormProps> = (props) => {
   const { children, className, ...rest } = props
   
   const componentsClass = 'm_Form'

  return (
    <form className={classNames(componentsClass, className)} {...rest}>
      {children}
    </form>
  )
}

export default Form
import React, { FC, ReactNode } from 'react'
import classNames from 'classnames'

export type WrapperProps = {
  children: ReactNode
  className?: string
  id?: string
  as?: 'div' | 'section' | 'header' | 'footer' | 'nav'
}

const Wrapper: FC<WrapperProps> = ({
  children,
  className,
  id,
  as: Component = 'div',
}) => {
  const componentsClass = 'l_Wrapper'

  return (
    <Component id={id} className={classNames(componentsClass, className)}>
      {children}
    </Component>
  )
}

export default Wrapper

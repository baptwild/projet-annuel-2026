import React, { FC } from 'react'
import Link from 'next/link'
import classNames from 'classnames'
import { ColorButton } from '@/enums/ColorButton'

export type ButtonProps = {
  label: string
  url?: string
  icon?: string
  type?: 'button' | 'submit' | 'reset'
  className?: string
  onClick?: () => void
  color?: ColorButton
  disabled?: boolean
}

const Button: FC<ButtonProps> = (props) => {
  const { label, url, icon, type = 'button', className, onClick, color, disabled } = props

  const componentsClass = 'a_Button'
  const classes = classNames(componentsClass, className, {
    [`${componentsClass}-${color}`]: color,
    [`${componentsClass}--disabled`]: disabled,
  })

  const content = (
    <>
      {icon && <i className={icon} aria-hidden='true' />}
      <span>{label}</span>
    </>
  )

  if (url) {
    return (
      <Link href={url} className={classes} onClick={onClick}>
        {content}
      </Link>
    )
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {content}
    </button>
  )
}

export default Button
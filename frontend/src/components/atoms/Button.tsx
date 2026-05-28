import React, { FC } from 'react'
import Link from 'next/link'
import classNames from 'classnames'
import { ColorButton } from '@/enums/ColorButton'

export type ButtonProps = {
  label: string
  url?: string
  type?: 'button' | 'submit' | 'reset'
  className?: string
  onClick?: () => void
  color?: ColorButton
}

const Button: FC<ButtonProps> = (props) => {
  const { label, url, type = 'button', className, onClick, color } = props

  const componentsClass = 'a_Button'
  const classes = classNames(componentsClass, className, {
    [`${componentsClass}-${color}`]: color,
  })

  if (url) {
    return (
      <Link href={url} className={classes} onClick={onClick}>
        {label}
      </Link>
    )
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {label}
    </button>
  )
}

export default Button

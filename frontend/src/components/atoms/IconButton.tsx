'use client'

import React, { FC } from 'react'
import classNames from 'classnames'
import Link from 'next/link'
import { ColorButton } from '@/enums/ColorButton'

export type IconButtonProps = {
  icon: string
  ariaLabel: string
  url?: string
  onClick?: () => void
  className?: string
  color?: ColorButton
  isExternal?: boolean
}

const IconButton: FC<IconButtonProps> = (props) => {
  const { icon, ariaLabel, url, onClick, className, color, isExternal } = props

  const componentsClass = 'a_IconButton'
  const classes = classNames(componentsClass, className, {
    [`${componentsClass}-${color}`]: color,
  })

  const content = <i className={icon} aria-hidden='true'></i>

  if (url) {
    if (isExternal) {
      return (
        <a
          href={url}
          className={classes}
          aria-label={ariaLabel}
          target='_blank'
          rel='noopener noreferrer'
        >
          {content}
        </a>
      )
    }
    return (
      <Link
        href={url}
        className={classes}
        aria-label={ariaLabel}
        onClick={onClick}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      type='button'
      className={classes}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  )
}

export default IconButton

import React, { FC, ReactNode } from 'react'
import NextLink from 'next/link'
import classNames from 'classnames'

export type NavLinkProps = {
  url: string
  label?: string
  icon?: string
  className?: string
  target?: string
  noUnderline?: boolean
  isExternal?: boolean
  ariaLabel?: string
  children?: ReactNode
}

const NavLink: FC<NavLinkProps> = (props) => {
  const {
    url,
    label,
    icon,
    className,
    target,
    noUnderline,
    isExternal,
    ariaLabel,
    children,
  } = props

  const componentsClass = 'a_NavLink'

  const classes = classNames(componentsClass, className, {
    'a_NavLink-noUnderline': noUnderline,
  })

  const content = (
    <>
      {icon && <i className={icon} />}
      {label && <span className={`${componentsClass}-label`}>{label}</span>}
      {children}
    </>
  )

  if (isExternal) {
    return (
      <a
        href={url}
        className={classes}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        aria-label={ariaLabel}
      >
        {content}
      </a>
    )
  }

  return (
    <NextLink href={url} className={classes} target={target} aria-label={ariaLabel}>
      {content}
    </NextLink>
  )
}

export default NavLink

'use client'

import Link from 'next/link'
import { FC } from 'react'

export type MobileMenuLinkProps = {
  url: string
  label: string
  onClick?: () => void
}

const MobileMenuLink: FC<MobileMenuLinkProps> = (props) => {
  const { url, label, onClick } = props

  const componentsClass = 'a_MobileMenuLink'

  return (
    <Link href={url} className={`${componentsClass}`} onClick={onClick}>
      <span className={`${componentsClass}_label`}>{label}</span>
      <i
        className={`bi bi-chevron-right ${componentsClass}_icon`}
        aria-hidden='true'
      ></i>
    </Link>
  )
}

export default MobileMenuLink

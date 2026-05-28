'use client'

import React, { FC } from 'react'
import NavLink from '../atoms/NavLink'
import Image from 'next/image'

import logoLarge from '../../../public/images/logos/logo-white-large.svg'
import useMediaQuery from '@/hooks/useMediaQuery'
import { ResponsiveSize } from '@/enums/MediaQuery'

export type HeroProps = {
  title: string
  subtitle: string
  address?: string
  showLogo?: boolean
  isHome?: boolean
}

const Hero: FC<HeroProps> = (props) => {
  const { title, subtitle, address, showLogo = false, isHome } = props

  const isDesktop = useMediaQuery(ResponsiveSize.SCREEN_S_MIN)

  const componentsClass = isHome ? 'o_HeroHome' : 'o_HeroStaticPage'

  return (
    <section className={componentsClass}>
      <div className={`${componentsClass}_content`}>
        {isHome && showLogo && (
          <div className={`${componentsClass}_logo`}>
            <Image
              src={logoLarge}
              alt='Logo Café des Chiens'
              width={isDesktop ? 576 : 307}
              height={isDesktop ? 315 : 168}
              priority
            />
          </div>
        )}

        <div className={`${componentsClass}_information`}>
          <h1 className={`${componentsClass}_title`}>{title}</h1>
          <h2 className={`${componentsClass}_subtitle`}>{subtitle}</h2>
          {isHome && address && (
            <h3 className={`${componentsClass}_address`}>{address}</h3>
          )}
        </div>
      </div>

      <NavLink
        url='#a-propos'
        icon='bi bi-chevron-down'
        className={`${componentsClass}_scroll`}
        noUnderline
      />
    </section>
  )
}

export default Hero

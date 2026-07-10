'use client'

import React, { FC } from 'react'
import NavLink from '../atoms/NavLink'
import Image from 'next/image'

import logoLarge from '../../../public/images/logos/logo-large.svg'
import useMediaQuery from '@/hooks/useMediaQuery'
import { ResponsiveSize } from '@/enums/MediaQuery'
import { useDaycareSafe } from '@/hooks/useDaycare'
import { FormattedAddress } from '../molecules/ContactInformation'

export type HeroProps = {
  title?: string
  subtitle?: string
  address?: string
  showLogo?: boolean
  isHome?: boolean
}

const Hero: FC<HeroProps> = (props) => {
  const { title, subtitle, address, showLogo = false, isHome } = props
  const daycare = useDaycareSafe()
  const displayTitle = title ?? daycare?.name ?? ''
  const displayAddress = address ?? daycare?.address

  const isDesktop = useMediaQuery(ResponsiveSize.SCREEN_S_MIN)

  const componentsClass = isHome ? 'o_HeroHome' : 'o_HeroStaticPage'

  return (
    <section className={componentsClass}>
      <div className={`${componentsClass}_content`}>
        {isHome && showLogo && (
          <div className={`${componentsClass}_logo`}>
            <Image
              src={logoLarge}
              alt={daycare ? `Logo ${daycare.name}` : 'Logo'}
              width={isDesktop ? 576 : 307}
              height={isDesktop ? 315 : 168}
              priority
            />
          </div>
        )}

        <div className={`${componentsClass}_information`}>
          <h1 className={`${componentsClass}_title`}>{displayTitle}</h1>
          {isHome && displayAddress && (
            <h2 className={`${componentsClass}_address`}>
              <FormattedAddress address={displayAddress} />
            </h2>
          )}
        </div>
      </div>

      <NavLink
        url='#a-propos'
        icon='bi bi-chevron-down'
        className={`${componentsClass}_scroll`}
        ariaLabel="Défiler vers la section suivante"
        noUnderline
      />
    </section>
  )
}

export default Hero

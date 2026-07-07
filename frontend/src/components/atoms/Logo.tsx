'use client'

import React, { FC } from 'react'
import Image from 'next/image'
import classNames from 'classnames'
import logoWhite from '../../../public/images/logos/logo-small.svg'

export type LogoProps = {
  isColorInverted?: boolean
  className?: string
}

const Logo: FC<LogoProps> = (props) => {
  const { isColorInverted, className } = props
  const componentsClass = 'a_Logo'

  return (
    <div className={classNames(componentsClass, className)} style={{ display: 'inline-flex', alignItems: 'center' }}>
      {isColorInverted ? (
        <div
          aria-label='Logo Garderie'
          style={{
            width: '150px',
            height: '50px',
            backgroundColor: 'var(--color-primary, #1D6980)',
            maskImage: `url(${logoWhite.src})`,
            WebkitMaskImage: `url(${logoWhite.src})`,
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
            transition: 'background-color 0.3s ease',
          }}
        />
      ) : (
        <Image
          className={`${componentsClass}-white`}
          src={logoWhite}
          alt='Logo Garderie'
          width={150}
          height={50}
          priority
        />
      )}
    </div>
  )
}

export default Logo
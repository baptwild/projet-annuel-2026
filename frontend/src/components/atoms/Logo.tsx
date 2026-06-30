import React, { FC } from 'react'
import Image from 'next/image'
import classNames from 'classnames'

import logoWhite from '../../../public/images/logos/logo-white-small.svg'
import logoColor from '../../../public/images/logos/logo-primary.svg'

export type LogoProps = {
  isColorInverted?: boolean
  className?: string
}

const Logo: FC<LogoProps> = (props) => {
  const { isColorInverted, className } = props

  const componentsClass = 'a_Logo'

  return (
    <div className={classNames(componentsClass, className)}>
      <Image
        className={classNames(componentsClass, {
          [`${componentsClass}-white`]: !isColorInverted,
          [`${componentsClass}-color`]: isColorInverted,
        })}
        src={isColorInverted ? logoColor : logoWhite}
        alt='Logo Café des Chiens'
        width={150}
        height={50}
        priority
      />
    </div>
  )
}

export default Logo

'use client'

import React, { FC, useEffect, useState } from 'react'
import classNames from 'classnames'
import Navbar from '../organisms/Navbar'
import MobileMenu from '../organisms/MobileMenu'
import { usePathname } from 'next/navigation'

const Header: FC = () => {
  const pathname = usePathname()
  const isHome = pathname === '/'

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    if (!isHome) return

    const handleScroll = () => {
      const offset = window.scrollY > 10
      if (isScrolled !== offset) setIsScrolled(offset)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHome, isScrolled])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset'
  }, [isMenuOpen])

  const componentsClass = 'l_Header'

  return (
    <>
      <header
        className={classNames(componentsClass, {
          [`${componentsClass}-transparent`]: isHome && !isScrolled,
        })}
      >
        <Navbar
          isTransparent={isHome && !isScrolled}
          onOpenMenu={() => setIsMenuOpen(true)}
        />
      </header>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  )
}

export default Header

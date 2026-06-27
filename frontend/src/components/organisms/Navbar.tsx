'use client'

import React, { FC } from 'react'
import Link from 'next/link'
import Logo from '../atoms/Logo'
import NavLink from '../atoms/NavLink'
import Button from '../atoms/Button'
import IconButton from '../atoms/IconButton'
import { ColorButton } from '@/enums/ColorButton'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

export type NavbarProps = {
  isTransparent?: boolean
  onOpenMenu?: () => void
}

const Navbar: FC<NavbarProps> = (props) => {
  const { isTransparent, onOpenMenu } = props
  const { isAuthenticated, isAdmin, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const componentsClass = 'o_Navbar'

  return (
    <nav className={componentsClass}>
      <Link href={'/'}>
        <Logo isColorInverted={!isTransparent} />
      </Link>
      <div className={`${componentsClass}_menu`}>
        <NavLink
          url='/'
          label='Parc'
          className={`${componentsClass}_menu-link`}
        />
        <NavLink
          url='/education'
          label='Éducation'
          className={`${componentsClass}_menu-link`}
        />
        <NavLink
          url='/tarifs'
          label='Tarifs'
          className={`${componentsClass}_menu-link`}
        />
        <NavLink
          url='/contact'
          label='Contact'
          className={`${componentsClass}_menu-link`}
        />
      </div>

      <div className={`${componentsClass}_links`}>
        <div className={`${componentsClass}_mobileMenu`}>
          {isAuthenticated && !isAdmin && (
            <IconButton
              url='/me'
              icon='bi bi-person-circle'
              ariaLabel='Mon Profil'
              className={`${componentsClass}_mobileMenu-link`}
            />
          )}
          <IconButton
            icon='bi bi-list'
            className='m_MobileMenu_open'
            onClick={onOpenMenu}
            ariaLabel='Ouvrir le menu mobile'
          />
        </div>

        <div className={`${componentsClass}_socials`}>
          <IconButton
            className={`${componentsClass}_socials-link`}
            url='https://www.facebook.com/cafedeschiens'
            icon='bi bi-facebook'
            ariaLabel='Facebook'
            isExternal
          />
          <IconButton
            className={`${componentsClass}_socials-link`}
            url='https://www.instagram.com/cafedeschiens'
            icon='bi bi-instagram'
            ariaLabel='Instagram'
            isExternal
          />
        </div>

        {isAuthenticated && !isAdmin && (
          <NavLink
            url='/booking'
            label='Réserver'
            className={`${componentsClass}_menu-link`}
          />
        )}
        {isAuthenticated && !isAdmin && (
          <NavLink
            url='/me'
            label='Mon profil'
            className={`${componentsClass}_menu-link`}
          />
        )}
        {isAdmin && (
          <NavLink
            url='/admin'
            label='Admin'
            className={`${componentsClass}_menu-link`}
          />
        )}

        <div className={`${componentsClass}_login`}>
          <Button
            label={isAuthenticated ? 'Déconnexion' : 'Connexion'}
            url={isAuthenticated ? undefined : '/login'}
            onClick={isAuthenticated ? handleLogout : undefined}
            color={isTransparent ? ColorButton.GHOST : ColorButton.PRIMARY}
            className='o_Navbar_login-button'
          />
        </div>
      </div>
    </nav>
  )
}

export default Navbar

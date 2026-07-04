'use client'

import React, { FC } from 'react'
import Link from 'next/link'
import Logo from '../atoms/Logo'
import NavLink from '../atoms/NavLink'
import Button from '../atoms/Button'
import IconButton from '../atoms/IconButton'
import { ColorButton } from '@/enums/ColorButton'
import { useAuth } from '@/hooks/useAuth'
import { useParams, useRouter } from 'next/navigation'

export type NavbarProps = {
  isTransparent?: boolean
  onOpenMenu?: () => void
}

const Navbar: FC<NavbarProps> = (props) => {
  const { isTransparent, onOpenMenu } = props
  const { isAuthenticated, isAdmin, userDaycareSlug, logout } = useAuth()
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  const isOwnDaycare = isAuthenticated && userDaycareSlug === slug

  const handleLogout = () => {
    logout()
    router.push(`/${slug}`)
  }

  const componentsClass = 'o_Navbar'

  return (
    <nav className={componentsClass}>
      <Link href={`/`}>
        <Logo isColorInverted={!isTransparent} />
      </Link>
      <div className={`${componentsClass}_menu`}>
        <NavLink
          url={`/${slug}`}
          label='Accueil'
          className={`${componentsClass}_menu-link`}
        />
        <NavLink
          url={`/${slug}/education`}
          label='Éducation'
          className={`${componentsClass}_menu-link`}
        />
        <NavLink
          url={`/${slug}/tarifs`}
          label='Tarifs'
          className={`${componentsClass}_menu-link`}
        />
        <NavLink
          url={`/${slug}/contact`}
          label='Contact'
          className={`${componentsClass}_menu-link`}
        />
      </div>

      <div className={`${componentsClass}_links`}>
        {isOwnDaycare && !isAdmin && (
          <>
            <NavLink
              url={`/${slug}/booking`}
              label='Réserver'
              className={`${componentsClass}_menu-link`}
            />
            <NavLink
              url={`/${slug}/me`}
              label='Mon profil'
              className={`${componentsClass}_menu-link`}
            />
          </>
        )}
        {isOwnDaycare && isAdmin && (
          <NavLink
            url={`/${slug}/admin`}
            label='Admin'
            className={`${componentsClass}_menu-link`}
          />
        )}

        <div className={`${componentsClass}_mobileMenu`}>
          {isOwnDaycare && !isAdmin && (
            <IconButton
              url={`/${slug}/me`}
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

        <div className={`${componentsClass}_login`}>
          {isOwnDaycare ? (
            <Button
              label='Déconnexion'
              onClick={handleLogout}
              color={isTransparent ? ColorButton.GHOST : ColorButton.PRIMARY}
              className={`${componentsClass}_login-button`}
            />
          ) : (
            <Button
              label='Connexion'
              url={`/${slug}/login`}
              color={isTransparent ? ColorButton.GHOST : ColorButton.PRIMARY}
              className={`${componentsClass}_login-button`}
            />
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

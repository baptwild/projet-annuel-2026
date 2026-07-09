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
      <Link href={`/${slug}`}>
        <Logo isColorInverted={!isTransparent} />
      </Link>
      <div className={`${componentsClass}_menu`}>
        <NavLink
          url={`/`}
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
        <div className={`${componentsClass}_desktopActions`}>
          {isOwnDaycare && !isAdmin && (
            <>
              <IconButton
                url={`/${slug}/me`}
                icon='bi bi-person-circle'
                ariaLabel='Mon profil'
                className={`${componentsClass}_profileIcon`}
              />
              <Button
                label='Réserver'
                url={`/${slug}/booking`}
                icon='bi bi-calendar-plus'
                color={isTransparent ? ColorButton.GHOST : ColorButton.OUTLINE}
                className={`${componentsClass}_action-button`}
              />

            </>
          )}

          {isOwnDaycare && isAdmin && (
            <Button
              label='Admin'
              url={`/${slug}/admin`}
              icon='bi bi-shield-lock'
              color={isTransparent ? ColorButton.SECONDARY : ColorButton.OUTLINE}
              className={`${componentsClass}_action-button`}
            />
          )}

          <div className={`${componentsClass}_login`}>
            {isOwnDaycare ? (
              <Button
                label='Déconnexion'
                icon={'bi bi-box-arrow-left'}
                onClick={handleLogout}
                color={isTransparent ? ColorButton.GHOST : ColorButton.PRIMARY}
                className={`${componentsClass}_login-button`}
              />
            ) : (
              <Button
                label='Connexion'
                icon={'bi bi-box-arrow-in-right'}
                url={`/${slug}/login`}
                color={isTransparent ? ColorButton.GHOST : ColorButton.PRIMARY}
                className={`${componentsClass}_login-button`}
              />
            )}
          </div>
        </div>
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
      </div>
    </nav>
  )
}

export default Navbar

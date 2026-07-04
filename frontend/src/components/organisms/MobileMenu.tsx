'use client'

import classNames from 'classnames'
import Link from 'next/link'
import { FC } from 'react'
import Logo from '../atoms/Logo'
import MobileMenuLink from '../atoms/MobileMenuLink'
import Button from '../atoms/Button'
import NavLink from '../atoms/NavLink'
import IconButton from '../atoms/IconButton'
import Wrapper from '../layout/Wrapper'
import { useAuth } from '@/hooks/useAuth'
import { useParams, useRouter } from 'next/navigation'
import { ColorButton } from '@/enums/ColorButton'
import { useDaycare } from '@/hooks/useDaycare'

export type MobileMenuProps = {
  isOpen: boolean
  onClose: () => void
}

const MobileMenu: FC<MobileMenuProps> = (props) => {
  const { isOpen, onClose } = props
  const { isAuthenticated, isAdmin, userDaycareSlug, logout } = useAuth()
  const daycare = useDaycare()
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  const isOwnDaycare = isAuthenticated && userDaycareSlug === slug

  const handleLogout = () => {
    logout()
    onClose()
    router.push(`/${slug}`)
  }

  const links = [
    { url: '/', label: 'Accueil' },
    { url: '/education', label: 'Éducation' },
    { url: '/prices', label: 'Tarifs' },
    { url: '/contact', label: 'Contact' },
  ]

  const componentsClass = 'o_MobileMenu'

  return (
    <div className={classNames('o_MobileMenu', { open: isOpen })}>
      <Wrapper className={`${componentsClass}_content`}>
        <div className={`${componentsClass}_header`}>
          <Link href={`/`} onClick={onClose}>
            <Logo
              isColorInverted={false}
              className={`${componentsClass}_logo`}
            />
          </Link>
          <IconButton
            icon='bi bi-x-lg'
            className={`${componentsClass}_close`}
            onClick={onClose}
            ariaLabel='Fermer le menu mobile'
          />
        </div>

        <ul className={`${componentsClass}_list`}>
          {links.map((link) => (
            <li key={link.url}>
              <MobileMenuLink
                url={`/${slug}${link.url}`}
                label={link.label}
                onClick={onClose}
              />
            </li>
          ))}
        </ul>

        <div className={`${componentsClass}_footer`}>
          <div className={`${componentsClass}_login`}>
            {isOwnDaycare ? (
              <>
                {isAdmin && (
                  <Button
                    label='Tableau de bord'
                    url={`/${slug}/admin`}
                    className={`${componentsClass}_button`}
                    onClick={onClose}
                    color={ColorButton.GHOST}
                  />
                )}
                {!isAdmin && (
                  <Button
                    label='Mon profil'
                    url={`/${slug}/me`}
                    className={`${componentsClass}_button`}
                    onClick={onClose}
                    color={ColorButton.GHOST}
                  />
                )}
                <Button
                  label='Déconnexion'
                  className={`${componentsClass}_button`}
                  onClick={handleLogout}
                  color={ColorButton.GHOST}
                />
              </>
            ) : (
              <Button
                label='Connexion'
                url={`/${slug}/login`}
                className={`${componentsClass}_button`}
                onClick={onClose}
                color={ColorButton.GHOST}
              />
            )}
          </div>
          {(daycare.facebook || daycare.instagram) && (
            <div className={`${componentsClass}_social`}>
              <NavLink
                url={daycare.facebook ?? ''}
                icon='bi bi-facebook'
                className={`${componentsClass}_social-link`}
                isExternal
                target='_blank'
              />
              <NavLink
                url={daycare.instagram ?? ''}
                icon='bi bi-instagram'
                className={`${componentsClass}_social-link`}
                isExternal
                target='_blank'
              />
            </div>
          )}
        </div>
      </Wrapper>
    </div>
  )
}

export default MobileMenu

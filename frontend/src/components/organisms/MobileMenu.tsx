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
import { useRouter } from 'next/navigation'

export type MobileMenuProps = {
  isOpen: boolean
  onClose: () => void
  isAdmin?: boolean
}

const MobileMenu: FC<MobileMenuProps> = (props) => {
  const { isOpen, onClose, isAdmin } = props
  const { isAuthenticated, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    onClose()
    router.push('/')
  }

  const links = [
    { url: '/', label: 'Parc' },
    { url: '/education', label: 'Éducation' },
    { url: '/prices', label: 'Tarifs' },
    { url: '/contact', label: 'Contact' },
  ]

  const componentsClass = 'o_MobileMenu'

  return (
    <div className={classNames('o_MobileMenu', { open: isOpen })}>
      <Wrapper className={`${componentsClass}_content`}>
        <div className={`${componentsClass}_header`}>
          <Link href={'/'} onClick={onClose}>
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
                url={link.url}
                label={link.label}
                onClick={onClose}
              />
            </li>
          ))}
        </ul>

        <div className={`${componentsClass}_footer`}>
          <div className={`${componentsClass}_login`}>
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Button
                    label='Tableau de bord'
                    url='/admin'
                    className='a_Button-secondary'
                    onClick={onClose}
                  />
                )}
                <Button
                  label='Déconnexion'
                  className='a_Button-secondary'
                  onClick={handleLogout}
                />
              </>
            ) : (
              <Button
                label='Connexion'
                url='/login'
                className='a_Button-secondary'
                onClick={onClose}
              />
            )}
          </div>
          <div className={`${componentsClass}_social`}>
            <NavLink
              url='https://www.facebook.com/cafedeschiens'
              icon='bi bi-facebook'
              className={`${componentsClass}_social-link`}
              isExternal
              target='_blank'
            />
            <NavLink
              url='https://www.instagram.com/cafedeschiens'
              icon='bi bi-instagram'
              className={`${componentsClass}_social-link`}
              isExternal
              target='_blank'
            />
          </div>
        </div>
      </Wrapper>
    </div>
  )
}

export default MobileMenu

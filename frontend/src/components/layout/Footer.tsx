'use client'

import React, { FC } from 'react'
import Wrapper from '../layout/Wrapper'
import Logo from '../atoms/Logo'
import NavLink from '../atoms/NavLink'
import Button from '../atoms/Button'
import IconButton from '../atoms/IconButton'
import { ColorButton } from '@/enums/ColorButton'

export type FooterProps = {
  user?: any
}

const Footer: FC<FooterProps> = (props) => {
  const { user } = props

  const sitemapLinks = [
    { url: '/', label: 'Le Parc' },
    { url: '/education', label: 'Éducation canine' },
    { url: '/tarifs', label: 'Tarifs' },
    { url: '/contact', label: 'Contact' },
  ]

  const openingHours = [
    { day: 'Lundi', time: 'Fermé' },
    { day: 'Mardi', time: '8h - 19h' },
    { day: 'Mercredi', time: '8h - 19h' },
    { day: 'Jeudi', time: '8h - 19h' },
    { day: 'Vendredi', time: '8h - 19h' },
    { day: 'Samedi', time: 'Fermé' },
    { day: 'Dimanche', time: 'Fermé' },
  ]

  const componentsClass = 'l_Footer'

  return (
    <footer className={componentsClass}>
      <Wrapper className={`${componentsClass}_content`}>
        <div className={`${componentsClass}_logo`}>
          <Logo isColorInverted={false} />
        </div>

        <div className={`${componentsClass}_menu`}>
          <h4 className={`${componentsClass}_title`}>Plan du site</h4>
          <ul className={`${componentsClass}_menu_list`}>
            {sitemapLinks.map((link) => (
              <li key={link.url} className={`${componentsClass}_menu_item`}>
                <NavLink
                  url={link.url}
                  label={link.label}
                  className={`${componentsClass}_menu_item-link`}
                />
              </li>
            ))}
            <li className={`${componentsClass}_menu_item`}>
              <Button
                url={user ? '/logout' : '/login'}
                label={user ? 'Déconnexion' : 'Connexion'}
                color={ColorButton.TERTIARY}
                className={`${componentsClass}_menu_item`}
              />
            </li>
          </ul>
        </div>

        <div className={`${componentsClass}_opening`}>
          <h4 className={`${componentsClass}_title`}>Horaires</h4>
          <ul className={`${componentsClass}_opening-list`}>
            {openingHours.map((item) => (
              <li key={item.day} className={`${componentsClass}_opening-item`}>
                <span className={`${componentsClass}_opening-item-day`}>
                  {item.day} :
                </span>
                <span className={`${componentsClass}_opening-item-time`}>
                  {item.time}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className={`${componentsClass}_contact`}>
          <h4 className={`${componentsClass}_title`}>Contact</h4>
          <ul className={`${componentsClass}_contact-list`}>
            <li className={`${componentsClass}_contact-item`}>
              <NavLink
                url='tel:+33630209394'
                icon='bi bi-telephone-fill'
                label='06 30 20 93 94'
                noUnderline
                className={`${componentsClass}_contact-link`}
              />
            </li>
            <li className={`${componentsClass}_contact-item`}>
              <NavLink
                url='mailto:contact@cafedeschiens.com'
                icon='bi bi-envelope-fill'
                label='contact@cafedeschiens.com'
                noUnderline
                className={`${componentsClass}_contact-link`}
              />
            </li>
          </ul>

          <div className={`${componentsClass}_contact-social`}>
            <IconButton
              url='https://www.facebook.com/cafedeschiens'
              icon='bi bi-facebook'
              ariaLabel='Facebook'
              isExternal
              className={`${componentsClass}_contact-social-link`}
            />
            <IconButton
              url='https://www.instagram.com/cafedeschiens'
              icon='bi bi-instagram'
              ariaLabel='Instagram'
              isExternal
              className={`${componentsClass}_contact-social-link`}
            />
          </div>

          <div className={`${componentsClass}_contact-info`}>
            <address className={`${componentsClass}_contact-address`}>
              <strong>Élise Collin</strong>
              <br />
              Éducatrice canine
              <br />
              Grenoble et son agglomération | Isère
              <br />
              Le Café des Chiens
              <br />
              Rue des Brassières
              <br />
              38420 Le Versoud
            </address>
          </div>
        </div>
      </Wrapper>
    </footer>
  )
}

export default Footer

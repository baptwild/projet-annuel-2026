'use client'

import React, { FC } from 'react'
import Wrapper from '../layout/Wrapper'
import Logo from '../atoms/Logo'
import NavLink from '../atoms/NavLink'
import IconButton from '../atoms/IconButton'
import { Daycare } from '@/types/Daycare'
import { FormattedAddress } from '../molecules/ContactInformation'

export type FooterProps = {
  user?: any
  daycare: Daycare
}

const ORDERED_DAYS: { value: number; label: string }[] = [
  { value: 1, label: 'Lundi' },
  { value: 2, label: 'Mardi' },
  { value: 3, label: 'Mercredi' },
  { value: 4, label: 'Jeudi' },
  { value: 5, label: 'Vendredi' },
  { value: 6, label: 'Samedi' },
  { value: 0, label: 'Dimanche' },
]

function formatTime(time: string): string {
  const [h, m] = time.split(':')
  return m === '00' ? `${parseInt(h, 10)}h` : `${parseInt(h, 10)}h${m}`
}

function buildOpeningHours(daycare: Daycare) {
  const range = `${formatTime(daycare.openingTime)} – ${formatTime(daycare.closingTime)}`
  return ORDERED_DAYS.map(({ value, label }) => ({
    day: label,
    time: daycare.openDays.includes(value) ? range : 'Fermé',
  }))
}

const SITEMAP_LINKS = [
  { label: 'Accueil', path: '' },
  { label: 'Éducation canine', path: '/education' },
  { label: 'Tarifs', path: '/tarifs' },
  { label: 'Contact', path: '/contact' },
]

const Footer: FC<FooterProps> = (props) => {
  const { user, daycare } = props

  const openingHours = buildOpeningHours(daycare)
  const base = `/${daycare.slug}`

  const componentsClass = 'l_Footer'

  return (
    <footer className={componentsClass}>
      <Wrapper className={`${componentsClass}_content`}>
        <div className={`${componentsClass}_logo`}>
          <Logo isColorInverted={false} />
          <div className={`${componentsClass}_contact-info`}>
            <address className={`${componentsClass}_contact-address`}>
              <strong>{daycare.name}</strong>
              <br />
              {daycare.address && (
                <FormattedAddress address={daycare.address} />
              )}
            </address>
          </div>
        </div>

        <div className={`${componentsClass}_menu`}>
          <h4 className={`${componentsClass}_title`}>Plan du site</h4>
          <ul className={`${componentsClass}_menu_list`}>
            {SITEMAP_LINKS.map((link) => (
              <li key={link.path} className={`${componentsClass}_menu_item`}>
                <NavLink
                  url={`${base}${link.path}`}
                  label={link.label}
                  className={`${componentsClass}_menu_item-link`}
                />
              </li>
            ))}
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
            {daycare.phone && (
              <li className={`${componentsClass}_contact-item`}>
                <NavLink
                  url={`tel:${daycare.phone.replace(/\s+/g, '')}`}
                  icon='bi bi-telephone-fill'
                  label={daycare.phone}
                  noUnderline
                  className={`${componentsClass}_contact-link`}
                />
              </li>
            )}
            {daycare.email && (
              <li className={`${componentsClass}_contact-item`}>
                <NavLink
                  url={`mailto:${daycare.email}`}
                  icon='bi bi-envelope-fill'
                  label={daycare.email}
                  noUnderline
                  className={`${componentsClass}_contact-link`}
                />
              </li>
            )}
          </ul>

          {(daycare.facebook || daycare.instagram) && (
            <div className={`${componentsClass}_contact-social`}>
              {daycare.facebook && (
                <IconButton
                  url={daycare.facebook}
                  icon='bi bi-facebook'
                  ariaLabel='Visiter notre page Facebook'
                  isExternal
                  className={`${componentsClass}_contact-social-link`}
                />
              )}
              {daycare.instagram && (
                <IconButton
                  url={daycare.instagram}
                  icon='bi bi-instagram'
                  ariaLabel='Visiter notre page Instagram'
                  isExternal
                  className={`${componentsClass}_contact-social-link`}
                />
              )}
            </div>
          )}
        </div>
      </Wrapper>
    </footer>
  )
}

export default Footer

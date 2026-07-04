'use client'

import React from 'react'
import Wrapper from '../layout/Wrapper'
import { useDaycare } from '@/hooks/useDaycare'
import { Daycare } from '@/types/Daycare'
import { FormattedAddress } from '../molecules/ContactInformation'

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
  if (!daycare.openingTime || !daycare.closingTime) {
    return ORDERED_DAYS.map(({ label }) => ({
      day: label,
      time: 'Non renseigné',
    }))
  }

  const range = `${formatTime(daycare.openingTime)} – ${formatTime(daycare.closingTime)}`
  return ORDERED_DAYS.map(({ value, label }) => ({
    day: label,
    time: daycare.openDays.includes(value) ? range : 'Fermé',
  }))
}

const ContactSection: React.FC = () => {
  const daycare = useDaycare()
  const componentsClass = 'o_ContactSection'
  const openingHours = buildOpeningHours(daycare)

  return (
    <Wrapper as='section' className={componentsClass} id='a-propos'>
      <div className={`${componentsClass}_contact`}>
        <h2 className={`${componentsClass}_contact-title`}>{daycare.name}</h2>
        <h3 className={`${componentsClass}_contact-subtitle`}>
          Coordonnées & Informations
        </h3>
        {daycare.address && (
          <p className={`${componentsClass}_contact-info`}>
            <FormattedAddress address={daycare.address} />
          </p>
        )}

        <ul className={`${componentsClass}_contact-list`}>
          {daycare.phone && (
            <li className={`${componentsClass}_contact-item`}>
              <a
                href={`tel:${daycare.phone.replace(/\s+/g, '')}`}
                className={`${componentsClass}_contact-link`}
              >
                <i className='bi bi-telephone-fill' />
                <span>{daycare.phone}</span>
              </a>
            </li>
          )}
          {daycare.email && (
            <li className={`${componentsClass}_contact-item`}>
              <a
                href={`mailto:${daycare.email}`}
                className={`${componentsClass}_contact-link`}
              >
                <i className='bi bi-envelope-fill' />
                <span>{daycare.email}</span>
              </a>
            </li>
          )}
        </ul>

        {(daycare.facebook || daycare.instagram) && (
          <div className={`${componentsClass}_contact-social`}>
            {daycare.facebook && (
              <a
                href={daycare.facebook}
                target='_blank'
                rel='noopener noreferrer'
                className={`${componentsClass}_contact-social-link`}
                aria-label='Facebook'
              >
                <i className='bi bi-facebook' />
              </a>
            )}
            {daycare.instagram && (
              <a
                href={daycare.instagram}
                target='_blank'
                rel='noopener noreferrer'
                className={`${componentsClass}_contact-social-link`}
                aria-label='Instagram'
              >
                <i className='bi bi-instagram' />
              </a>
            )}
          </div>
        )}
      </div>

      <div className={`${componentsClass}_contact`}>
        <h2 className={`${componentsClass}_contact-title`}>
          {daycare.name}
        </h2>
        <h3 className={`${componentsClass}_contact-subtitle`}>
          Horaires d&rsquo;ouverture
        </h3>
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
    </Wrapper>
  )
}

export default ContactSection
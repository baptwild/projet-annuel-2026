import React, { Fragment } from 'react'
import Link from 'next/link'
import { Daycare } from '@/types/Daycare'
import classNames from 'classnames'

const API = process.env.API_URL_INTERNAL ?? process.env.NEXT_PUBLIC_API_URL

async function fetchDaycares(): Promise<Daycare[]> {
  try {
    const res = await fetch(`${API}/api/daycares`, {
      headers: { Accept: 'application/ld+json' },
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return data['hydra:member'] ?? data['member'] ?? []
  } catch {
    return []
  }
}

function getLightTint(hexString: string, opacity = 0.08) {
  let hex = hexString.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export default async function DaycareList() {
  const daycares = await fetchDaycares()

  const componentsClass = 'o_DaycareList'

  if (daycares.length === 0) {
    return (
      <div
        className={`${componentsClass}_empty`}>
        <i className='bi bi-building-exclamation'></i>
        <p>Aucune garderie disponible pour le moment.</p>
      </div>
    )
  }

  return (
    <div className={`${componentsClass}_list`} >
      {daycares.map((daycare) => {
        const primaryColor = daycare.colorPrimary || '#1D6980'
        const lightBgColor = getLightTint(primaryColor, 0.06)

        return (
          <Link
            className={`${componentsClass}_card`}
            key={daycare.id}
            href={`/${daycare.slug}`}
            style={{
              borderColor: primaryColor,
              '--card-primary': primaryColor,
              '--card-bg-hover': lightBgColor,
            } as React.CSSProperties}
          >

            <div className={`${componentsClass}_card-body`}>
              <div className={`${componentsClass}_card-information`}>
                <h3 className={`${componentsClass}_card-title`} >
                  {daycare.name}
                </h3>
                <span className={classNames(`${componentsClass}_card-status`, {
                  [`${componentsClass}_card-status-active`]: daycare.isActive,
                })}
                >
                  {daycare.isActive ? 'Ouvert' : 'Fermé'}
                </span>
              </div>

              <div className={`${componentsClass}_card-address`}>
                <i className='bi bi-geo-alt-fill' style={{ color: primaryColor }}></i>
                <div className={`${componentsClass}_card-address-content`}>
                  {daycare.address ? (
                    daycare.address.split(',').map((line, idx, arr) => (
                      <Fragment key={idx}>
                        {line.trim()}
                        {idx < arr.length - 1 && <br />}
                      </Fragment>
                    ))
                  ) : (
                    <span>Adresse non spécifiée</span>
                  )}
                </div>
              </div>

              <div
                className={`${componentsClass}_card-hours`}>
                <i className='bi bi-clock-fill' style={{ color: primaryColor }}></i>
                <span className={`${componentsClass}_card-hours-content`}>
                  {daycare.openingTime
                    ? `${daycare.openingTime} - ${daycare.closingTime}`
                    : 'Horaires non précisés'}
                </span>
              </div>

              <div className={`${componentsClass}_card-button`} >
                <span style={{ color: primaryColor, borderColor: primaryColor }} >
                  Visiter {daycare.name} <i className='bi bi-arrow-right'></i>
                </span>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

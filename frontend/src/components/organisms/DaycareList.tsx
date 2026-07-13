import React, { Fragment } from 'react'
import Link from 'next/link'
import { Daycare } from '@/types/Daycare'
import classNames from 'classnames'

const API = process.env.API_URL_INTERNAL ?? process.env.NEXT_PUBLIC_API_URL

async function fetchDaycares(): Promise<Daycare[]> {
  try {
    const res = await fetch(`${API}/api/daycares`, {
      headers: { Accept: 'application/ld+json' },
      cache: 'no-store',
    })
    if (!res.ok) return []
    const data = await res.json()
    return data['hydra:member'] ?? data['member'] ?? []
  } catch (error) {
    console.error(error)
    return []
  }
}

function getLightTint(hexString: string, opacity = 0.08) {
  let hex = hexString.replace('#', '')
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

function isDaycareCurrentlyOpen(daycare: Daycare): boolean {
  if (!daycare.openingTime || !daycare.closingTime || !daycare.openDays?.length) return false

  const now = new Date()
  const currentDay = now.getDay()

  if (!daycare.openDays.includes(currentDay)) {
    return false
  }

  const currentTimeStr = now.toLocaleTimeString('fr-FR', {
    timeZone: 'Europe/Paris',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  const openStr = daycare.openingTime.substring(0, 5)
  const closeStr = daycare.closingTime.substring(0, 5)

  return currentTimeStr >= openStr && currentTimeStr <= closeStr
}

const DAY_NAMES: Record<number, string> = {
  1: 'lundi',
  2: 'mardi',
  3: 'mercredi',
  4: 'jeudi',
  5: 'vendredi',
  6: 'samedi',
  0: 'dimanche'
}

function formatOpeningDaysStr(openDays: number[]) {
  if (!openDays || openDays.length === 0) return ''

  const sortedDays = [...openDays].sort((a, b) => {
    const aValue = a === 0 ? 7 : a
    const bValue = b === 0 ? 7 : b
    return aValue - bValue
  })

  const firstDay = DAY_NAMES[sortedDays[0]]
  const lastDay = DAY_NAMES[sortedDays[sortedDays.length - 1]]

  if (sortedDays.length === 1) return `Ouvert le ${firstDay}`

  return `Ouvert du ${firstDay} au ${lastDay}`
}

function formatClosedDaysStr(openDays: number[]) {
  const allDays = [1, 2, 3, 4, 5, 6, 0]
  const closedDays = allDays.filter(day => !openDays.includes(day))

  if (closedDays.length === 0) return null

  const labels = closedDays.map(d => DAY_NAMES[d])

  if (labels.length === 1) return `Fermé le ${labels[0]}`

  const last = labels.pop()
  return `Fermé le ${labels.join(', ')} et le ${last}`
}

export default async function DaycareList() {
  const daycares = await fetchDaycares()

  const componentsClass = 'o_DaycareList'

  if (daycares.length === 0) {
    return (
      <div className={`${componentsClass}_empty`}>
        <i className='bi bi-building-exclamation'></i>
        <p>Aucune garderie disponible pour le moment.</p>
      </div>
    )
  }

  return (
    <div className={`${componentsClass}_list`}>
      {daycares.map((daycare) => {
        const primaryColor = daycare.colorPrimary || '#1D6980'
        const lightBgColor = getLightTint(primaryColor, 0.06)
        const isOpenNow = isDaycareCurrentlyOpen(daycare)

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
                <h3 className={`${componentsClass}_card-title`}>
                  {daycare.name}
                </h3>
                <span
                  className={classNames(`${componentsClass}_card-status`, {
                    [`${componentsClass}_card-status-active`]: isOpenNow,
                  })}
                >
                  {isOpenNow ? 'Ouvert' : 'Fermé'}
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

              <div className={`${componentsClass}_card-hours`}>
                <i className='bi bi-clock-fill' style={{ color: primaryColor }}></i>
                <div className={`${componentsClass}_card-hours-content`}>
                  {daycare.openingTime && daycare.openDays?.length ? (
                    <>
                      <p className={`${componentsClass}_card-hours-content-open`}>{formatOpeningDaysStr(daycare.openDays)}</p>
                      <p className={`${componentsClass}_card-hours-content-time`}>
                        De {daycare.openingTime.substring(0, 5)} à {daycare.closingTime.substring(0, 5)}
                      </p>
                      {formatClosedDaysStr(daycare.openDays) && (
                        <p className={`${componentsClass}_card-hours-content-closed`}>
                          {formatClosedDaysStr(daycare.openDays)}
                        </p>
                      )}
                    </>
                  ) : (
                    <p>Horaires non précisés</p>
                  )}
                </div>
              </div>

              <div className={`${componentsClass}_card-button`}>
                <span style={{ color: primaryColor, borderColor: primaryColor }}>
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
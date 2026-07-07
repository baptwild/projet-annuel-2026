'use client'

import React, { Fragment } from 'react'
import InformationBanner from '@/components/organisms/InformationBanner'
import Button from '@/components/atoms/Button'
import { ColorButton } from '@/enums/ColorButton'
import { useDaycare } from '@/hooks/useDaycare'
import { useParams } from 'next/navigation'

export const FormattedAddress: React.FC<{ address?: string | null }> = ({ address }) => {
  if (!address) return null

  return (
    <>
      {address.split(',').map((line, index, arr) => (
        <Fragment key={index}>
          {line.trim()}
          {index < arr.length - 1 && <br />}
        </Fragment>
      ))}
    </>
  )
}

const ContactInformation: React.FC = () => {
   const daycare = useDaycare()
   const params = useParams()
   const slug = params?.slug as string

  return (
    <InformationBanner
      left={
        <>
          <h4 className='o_InformationBanner_title'>Où me trouver</h4>
          <p className='o_InformationBanner_description'>
            <FormattedAddress address={daycare.address} />
          </p>
          <Button
            label='En savoir plus'
            url={`/${slug}/education`}
            color={ColorButton.PRIMARY}
            className='o_InformationBanner_button'
          />
        </>
      }
      right={
        <>
          <h4 className='o_InformationBanner_title'>Comment me contacter</h4>
          {daycare.phone && (
            <a href={`tel:${daycare.phone.replace(/\s+/g, '')}`} className='o_InformationBanner_icon'>
              <i className='bi bi-telephone-fill'></i>
              <span className='o_InformationBanner_icon-text'>{daycare.phone}</span>
            </a>
          )}
          {daycare.email && (
            <a href={`mailto:${daycare.email}`} className='o_InformationBanner_icon'>
              <i className='bi bi-envelope-fill'></i>
              <span className='o_InformationBanner_icon-text'>{daycare.email}</span>
            </a>
          )}
          {(daycare.openingTime || daycare.closingTime) && (
            <div className='o_InformationBanner_icon'>
              <i className='bi bi-clock-fill'></i>
              <span className='o_InformationBanner_icon-text'>
                Horaires : {daycare.openingTime || '08:00'} - {daycare.closingTime || '18:00'}
              </span>
            </div>
          )}
        </>
      }
    />
  )
}

export default ContactInformation
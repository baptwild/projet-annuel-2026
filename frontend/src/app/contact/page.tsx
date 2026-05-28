import React from 'react'
import InformationBanner from '@/components/organisms/InformationBanner'
import Button from '@/components/atoms/Button'
import { ColorButton } from '@/enums/ColorButton'
import Hero from '@/components/organisms/Hero'
import ContactSection from '@/components/organisms/ContactSection'

export const metadata = {
  title: 'Contact | Le Café des Chiens - Élise Collin',
}

export default function ContactPage() {
  return (
    <main className='p_Static'>
      <Hero title='Contact' subtitle='Élise Collin' isHome={false} />
      <ContactSection />
      <InformationBanner
        left={
          <>
            <h4 className='o_InformationBanner_title'>Où me trouver</h4>
            <p className='o_InformationBanner_description'>
              Vous me trouverez non loin de Grenoble, au Versoud.
              <br />
              Je me déplace sur Grenoble et ses environs.
            </p>
            <Button
              label='En savoir plus'
              url='/education'
              color={ColorButton.PRIMARY}
              className='o_InformationBanner_button'
            />
          </>
        }
        right={
          <>
            <h4 className='o_InformationBanner_title'>Comment me contacter</h4>
            <a href='tel:+33630209394' className='o_InformationBanner_icon'>
              <i className='bi bi-telephone-fill'></i>
              <span className='o_InformationBanner_icon-text'>
                06 30 20 93 94
              </span>
            </a>
            <a
              href='mailto:contact@cafedeschiens.com'
              className='o_InformationBanner_icon'
            >
              <i className='bi bi-envelope-fill'></i>
              <span className='o_InformationBanner_icon-text'>
                contact@cafedeschiens.com
              </span>
            </a>
          </>
        }
      />
    </main>
  )
}

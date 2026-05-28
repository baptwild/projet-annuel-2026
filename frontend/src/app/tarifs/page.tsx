import React from 'react'
import InformationBanner from '@/components/organisms/InformationBanner'
import Button from '@/components/atoms/Button'
import { ColorButton } from '@/enums/ColorButton'
import Hero from '@/components/organisms/Hero'
import PriceCardList from '@/components/organisms/PriceCardList'

export const metadata = {
  title: 'Tarifs | Le Café des Chiens - Élise Collin',
}

export default function PricesPage() {
  return (
    <main className='p_Static'>
      <Hero title='Tarifs' subtitle='Le Café des Chiens' isHome={false} />
      <PriceCardList />
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

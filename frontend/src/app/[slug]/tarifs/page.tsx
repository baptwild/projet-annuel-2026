import React from 'react'
import Hero from '@/components/organisms/Hero'
import PriceCardList from '@/components/organisms/PriceCardList'
import ContactInformation from '@/components/molecules/ContactInformation'

export const metadata = {
  title: 'Tarifs | Garderie canine',
}

export default function PricesPage() {
  return (
    <div className='p_Static'>
      <Hero title='Tarifs' isHome={false} />
      <PriceCardList />
      <ContactInformation />
    </div>
  )
}

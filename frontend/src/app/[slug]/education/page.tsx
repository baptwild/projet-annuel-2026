import React from 'react'
import Hero from '@/components/organisms/Hero'
import AboutMeStatic from '@/components/organisms/AboutMeStatic'
import MethodList from '@/components/organisms/MethodList'
import ContactInformation from '@/components/molecules/ContactInformation'

export const metadata = {
  title: 'Éducation Canine | Garderie canine',
}

export default function EducationPage() {
  return (
    <div className='p_Static'>
      <Hero title='Éducateur canin' isHome={false} />
      <AboutMeStatic />
      <MethodList />
      <ContactInformation />
    </div>
  )
}

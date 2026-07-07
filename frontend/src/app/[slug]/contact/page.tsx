import React from 'react'
import Hero from '@/components/organisms/Hero'
import ContactSection from '@/components/organisms/ContactSection'
import ContactInformation from '@/components/molecules/ContactInformation'

export const metadata = {
  title: 'Contact | Garderie canine',
}

export default function ContactPage() {
  return (
    <div className='p_Static'>
      <Hero title='Contact' isHome={false} />
      <ContactSection />
      <ContactInformation />
    </div>
  )
}

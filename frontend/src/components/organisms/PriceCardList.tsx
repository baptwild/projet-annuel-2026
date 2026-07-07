'use client'

import React from 'react'
import Wrapper from '../layout/Wrapper'
import PriceCard, { PriceCardProps } from '../molecules/PriceCard'

import imageGarderie from '@/../public/images/centre-aere-pour-chiens.webp'
import imageCollectif from '@/../public/images/cours-collectifs-pour-chiens.webp'
import { useDaycare } from '@/hooks/useDaycare'
import { useParams } from 'next/navigation'

const PriceCardList: React.FC = () => {
  const daycare = useDaycare()
  const params = useParams()
  const slug = params?.slug as string

  const priceString = `${daycare.priceHalfDay ?? 13}€ à ${daycare.pricePerUnit ?? 16}€ la journée`
  
  const garderieDescriptions = [
    `${daycare.priceHalfDay ?? 13}€ la demi-journée (4h max)`,
    `${daycare.pricePerUnit ?? 16}€ la journée complète`,
    'Surveillé par mes soins tout au long de la journée',
    `Capacité d'accueil : ${daycare.maxDogsPerDay ?? 10} chiens maximum`,
    'Vaccin de la toux de chenil obligatoire',
    'Chien à partir de 3 mois',
    'Sous réserve de bon comportement en groupe',
  ]

  if (daycare.weeklyDiscountEnabled && daycare.weeklyDiscountPercent) {
    garderieDescriptions.push(
      `Remise de ${daycare.weeklyDiscountPercent}% à partir de ${daycare.weeklyDiscountThreshold} jours / semaine`
    )
  }

  const priceData: PriceCardProps[] = [
    {
      image: imageGarderie,
      title: 'Forfait garderie',
      price: priceString,
      description: garderieDescriptions,
      link: `/${slug}/booking`,
      label: 'Réserver',
    },
    {
      image: imageCollectif,
      title: 'Cours & Options',
      price: daycare.tierPrice ? `${daycare.tierPrice}€ le forfait` : 'Sur demande',
      description: [
        'Horaires flexibles selon les jours d’ouverture',
        'Sur réservation uniquement',
        `Sur place, à ${daycare.name}`,
        'Accompagnement personnalisé',
      ],
      link: `/${slug}/contact`,
      label: 'En savoir plus',
    },
  ]

  const componentsClass = 'o_PriceCardList'

  return (
    <Wrapper as='section' className={componentsClass} id='liste-de-tarifs'>
      {priceData.map((card, index) => (
        <PriceCard key={index} {...card} />
      ))}
    </Wrapper>
  )
}

export default PriceCardList

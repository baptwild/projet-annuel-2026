import React from 'react'
import Wrapper from '../layout/Wrapper'
import PriceCard, { PriceCardProps } from '../molecules/PriceCard'

import imageGarderie from '@/../public/images/centre-aere-pour-chiens.webp'
import imageCollectif from '@/../public/images/cours-collectifs-pour-chiens.webp'

const PriceCardList: React.FC = () => {
  const componentsClass = 'o_PriceCardList'

  const priceData: PriceCardProps[] = [
    {
      image: imageGarderie,
      title: 'Forfait garderie',
      price: '13€ à 16€ la journée',
      description: [
        '13€ la demi-journée (4h max)',
        '16€ la journée',
        'Surveillé par mes soins tout au long de la journée',
        'Votre chien est en compagnie d’une dizaine de chiens',
        'Vaccin de la toux de chenil obligatoire',
        'Chien à partir de 3 mois',
        'Sur réserve de bon comportement en groupe de votre chien',
      ],
      link: '/reservation',
      label: 'Réserver',
    },
    {
      image: imageCollectif,
      title: 'Cours collectifs',
      price: '18€ la séance',
      description: [
        'Le samedi de 14h à 15h',
        'Sur réservation',
        'Sur place, au Café des Chiens',
        '5 séances minimum',
        '5 chiens maximum',
      ],
      link: '/education',
      label: 'En savoir plus',
    },
  ]

  return (
    <Wrapper as='section' className={componentsClass} id='liste-de-tarifs'>
      {priceData.map((card, index) => (
        <PriceCard key={index} {...card} />
      ))}
    </Wrapper>
  )
}

export default PriceCardList

import React from 'react'
import Wrapper from '../layout/Wrapper'
import ReinsuranceItem, {
  ReinsuranceItemProps,
} from '../molecules/ReinsuranceItem'

const ReinsuranceList: React.FC = () => {
  const componentsClass = 'o_ReinsuranceList'

  const items: ReinsuranceItemProps[] = [
    {
      icon: 'bi bi-check-lg',
      title: 'Confiance',
      description:
        'Une professionnelle à votre écoute pour les besoins de votre chien',
    },
    {
      icon: 'bi bi-people-fill',
      title: 'Sociabilisation',
      description:
        'Une parfaite sociabilisation de votre chien avec ses congénères',
    },
    {
      icon: 'bi bi-joystick',
      title: 'Jeu',
      description:
        "Des jeux d'éveils et d'éducation seront là pour renforcer l'apprentissage de votre chien",
    },
  ]

  return (
    <section className={componentsClass}>
      <Wrapper>
        <div className={`${componentsClass}_list`}>
          {items.map((item, index) => (
            <ReinsuranceItem
              key={index}
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </Wrapper>
    </section>
  )
}

export default ReinsuranceList

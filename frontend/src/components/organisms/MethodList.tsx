import React from 'react'
import Image from 'next/image'
import Wrapper from '../layout/Wrapper'
import MethodCard, { MethodCardProps } from '../molecules/MethodCard'
import imageTraining from '@/../public/images/elise-collin-dressage-chiens.webp'

const MethodList: React.FC = () => {
  const componentsClass = 'o_MethodList'

  const methodCards: MethodCardProps[] = [
    {
      icon: 'bi bi-book-fill',
      title: 'Éducation',
      description: [
        'Sociabilisez votre chien',
        'Apprenez lui et apprennez avec lui',
        'Un lien plus fort avec votre animal',
      ],
    },
    {
      icon: 'bi bi-cup-hot-fill',
      title: 'Le Café des Chiens',
      description: [
        'Un centre aéré pour votre chien',
        'Un parc de plus de 2000m²',
        'Sociabilisation en meute',
      ],
    },
    {
      icon: 'bi bi-fork-knife',
      title: 'Nutrition',
      description: [
        'Choisir l’alimentation de son chien est un casse-tête',
        'Chaque chien a ses besoins nutritifs, je vous aide à trouver la bonne qualité',
        'Suivons ensemble son alimentation pour son bien-être',
      ],
    },
  ]

  return (
    <Wrapper as='section' className={componentsClass}>
      <div className={`${componentsClass}_intro`}>
        <h2 className={`${componentsClass}_intro-title`}>
          {`Méthode d'éducation`}
        </h2>
        <p className={`${componentsClass}_intro-subtitle`}>
          {`Pour que votre chien vive le plus possible en harmonie avec vous, qu'il n'agisse pas par peur mais par envie. On parle alors de construire une relation pour rendre la cohabitation entre un maître et son chien plus harmonieuse et agréable.`}
        </p>
      </div>

      <div className={`${componentsClass}_section`}>
        <h3 className={`${componentsClass}_section-title`}>
          {`La méthode positive`}
        </h3>
        <p className={`${componentsClass}_section-text`}>
          {`Comme pour un enfant vous aurez le choix de la méthode traditionnelle ou douce.`}
          <br />
          {`La méthode douce récompense les bonnes actions, montre à l'animal ce qu'il faut faire pour être récompensé au lieu de le blamer à longueur de temps.`}
          <br />
          {`Car oui, un chien peut se décourager dans son éducation et comme nous l'avons tous remarqué, un chien peut être têtu...très têtu. La récompense pour un chien n'est pas forcément une friandise, une simple caresse de votre part, un encouragement le motivera également.`}
          <br />
          {`Cette méthode vous aidera à faire de votre chien votre ami, un véritable compagnon.`}
          <br />
          {`On joue davantage sur la motivation que sur l’inhibition. Ensemble nous apprendrons à bien comprendre les comportements de votre chien, ses attitudes et ses réactions afin de bien cibler la récompense qui sera la plus efficace.`}
        </p>
      </div>

      <div className={`${componentsClass}_section`}>
        <h3 className={`${componentsClass}_section-title`}>
          {`Bénéfique autant pour le chien que pour vous`}
        </h3>
        <p className={`${componentsClass}_section-text`}>
          {`Réprimender à longueur de journée n'est pas plus agréable pour vous que pour le chien. Savoir obtenir quelque chose de son chien sans crier, non seulement économisera votre énergie, mais également boostera votre calme.`}
          <br />
          {`Vous découvrirez de nouvelles émotions et un lien plus fort avec votre chien.`}
        </p>
      </div>

      <div className={`${componentsClass}_section`}>
        <h3 className={`${componentsClass}_section-title`}>
          {`Fixer les limites à son chien`}
        </h3>
        <p className={`${componentsClass}_section-text`}>
          {`Un chien ayant également besoin de limites, nous apprendrons comment
          lui en fixer. Je vous montrerai comment devenir l’être de référence
          auquel votre chien peut se fier, car vous savez ce qui est bon ou non
          pour lui.`}
        </p>
      </div>

      <div className={`${componentsClass}_image`}>
        <Image
          src={imageTraining}
          alt='Élise Collin - Éducatrice Canine avec son chien'
          placeholder='blur'
        />
      </div>

      <div className={`${componentsClass}_cardList`}>
        {methodCards.map((card, index) => (
          <MethodCard
            key={index}
            icon={card.icon}
            title={card.title}
            description={card.description}
          />
        ))}
      </div>
    </Wrapper>
  )
}

export default MethodList

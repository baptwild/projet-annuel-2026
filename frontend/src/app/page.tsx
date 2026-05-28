import AboutMeHome from '@/components/organisms/AboutMeHome'
import AboutSection from '@/components/organisms/AboutSection'
import CardList from '@/components/organisms/CardList'
import CostBanner from '@/components/organisms/CostBanner'
import Hero from '@/components/organisms/Hero'
import { CardProps } from '@/components/molecules/Card'

import imageTime from '@/../public/images/illustrations/travailler.webp'
import imageDestruction from '@/../public/images/illustrations/canape.webp'
import imageBark from '@/../public/images/illustrations/aboyer.webp'
import imageSleep from '@/../public/images/chien-sieste.webp'
import imageLearning from '@/../public/images/chien-apprentissage.webp'
import imageSocial from '@/../public/images/sociabilisation-chiens.webp'
import ReinsuranceList from '@/components/organisms/ReinsuranceList'
import LocationSection from '@/components/organisms/LocationSection'
import InformationBanner from '@/components/organisms/InformationBanner'
import Button from '@/components/atoms/Button'
import { ColorButton } from '@/enums/ColorButton'

export default function Home() {
  const needsCards: CardProps[] = [
    {
      image: imageTime,
      title: 'Temps',
      description:
        "Il n'est pas toujours évident au quotidien de lui consacrer suffisamment de temps : une journée de travail plus longue que d'habitude, accompagner les enfants au sport, faire les courses pour la famille...",
    },
    {
      image: imageDestruction,
      title: 'Destructions',
      description:
        "Votre chien demande une attention particulière et ses besoins ne se limitent pas qu'à des besoins affectifs. Des absences trop longues et des dépenses trop courtes peuvent conduire votre chien à détruire dès que vous aurez le dos tourné.",
    },
    {
      image: imageBark,
      title: 'Aboiements',
      description:
        "Votre chien a besoin de liberté, d'échanger avec ses congénères, de découvrir des choses. Manquer à ses besoins d'épanouissement personnel peut vite se traduire par des aboiements à longueur de journée lorsque vous n'êtes pas là.",
    },
  ]

  const benefitCards: CardProps[] = [
    {
      image: imageSleep,
      title: 'Chien apaisé',
      description:
        'Grâce à nous votre chien aura eu une journée bien remplie et plusieurs de ses besoins auront été comblés...',
    },
    {
      image: imageLearning,
      title: 'Apprentissage',
      description:
        "L'apprentissage permet de libérer l'énergie accumulée de votre chien et de répondre à son bien-être mental.",
    },
    {
      image: imageSocial,
      title: 'Chien sociable',
      description:
        "Les bienfaits du Café des chiens sont entre autres de renforcer l'apprentissage du code canin de votre toutou.",
    },
  ]

  const componentsClass = 'p_Home'

  return (
    <div className={componentsClass}>
      <Hero
        title='Le centre aéré pour votre chien'
        subtitle='Le Café des Chiens'
        address={'Rue des Brassières - Le Versoud'}
        isHome={true}
        showLogo={true}
      />
      <AboutSection />
      <AboutMeHome />
      <CardList list={needsCards} />
      <CostBanner />
      <CardList list={benefitCards} />
      <ReinsuranceList />
      <LocationSection />
      <InformationBanner
        left={
          <>
            <h4 className='o_InformationBanner_title'>Horaires</h4>
            <p className='o_InformationBanner_description'>
              {`Vous venez déposer votre chien à votre convenance au centre aéré
              pendant ses heures d'ouverture.`}
              <br />
              {`Que ce soit pour la journée ou quelques heures.`}
            </p>
            <div className='o_InformationBanner_icon'>
              <i className='bi bi-calendar-week'></i>
              <span className='o_InformationBanner_icon-text'>
                {`Du mardi au vendredi`}
              </span>
            </div>
            <div className='o_InformationBanner_icon'>
              <i className='bi bi-clock'></i>
              <span className='o_InformationBanner_icon-text'>{`De 8h à 19h`}</span>
            </div>
          </>
        }
        right={
          <>
            <h4 className='o_InformationBanner_title'>Forfaits et Tarifs</h4>
            <p className='o_InformationBanner_description'>
              {`À la journée ou demi-journée, choisissez ce qui vous convient le
              mieux.`}
            </p>
            <Button
              label='En savoir plus'
              url='/tarifs'
              color={ColorButton.PRIMARY}
              className='o_InformationBanner_button'
            />
          </>
        }
      />
    </div>
  )
}

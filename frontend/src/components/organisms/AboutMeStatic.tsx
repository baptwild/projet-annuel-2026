import React from 'react'
import Image from 'next/image'
import Wrapper from '../layout/Wrapper'
import profileImage from '../../../public/images/elise-collin.webp'

const AboutMeStatic: React.FC = () => {
  const componentsClass = 'o_AboutMeStatic'

  return (
    <section className={componentsClass} id='a-propos'>
      <Wrapper>
        <div className={`${componentsClass}_content`}>
          <div className={`${componentsClass}_text`}>
            <h3 className={`${componentsClass}_text-title`}>Qui suis-je ?</h3>
            <p className={`${componentsClass}_text-description`}>
              {`Passionnée par le monde animal depuis ma tendre enfance je me suis lancée dans l'éducation canine en 2017. Depuis environ 8 ans je faisais du gardiennage de chiens et mon amour pour ceux-ci m'a conduite à chercher un travail avec eux. C'est ainsi qu'aujourd'hui je vous propose mes services après avoir suivi une formation très sérieuse à Tullins (Isère). La formation prodiguée par Mr Yann Forêt, responsable du centre de formation Entre Chiens, ainsi que divers intervenants et notamment la vétérinaire Dr Sylvia Masson, diplômée dans le comportement canin. Nous avons également eu la chance de profiter des enseignements de la docteure Maud Clavel Dufaure De Citres vétérinaire en nutrition.`}
            </p>
          </div>
          <div className={`${componentsClass}_image`}>
            <Image
              src={profileImage}
              alt="Photo de profil d'Elise Collin"
              placeholder='blur'
              width={400}
              height={500}
              style={{ objectFit: 'cover', borderRadius: '8px' }}
            />
          </div>
        </div>
      </Wrapper>
    </section>
  )
}

export default AboutMeStatic

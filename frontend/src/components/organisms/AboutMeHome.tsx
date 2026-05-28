import React from 'react'
import Image from 'next/image'
import Wrapper from '../layout/Wrapper'
import Button from '../atoms/Button'
import { ColorButton } from '@/enums/ColorButton'
import profileImg from '../../../public/images/elise-collin-educatrice-canin.webp'

const AboutMeHome: React.FC = () => {
  const componentsClass = 'o_AboutMeHome'

  return (
    <section className={componentsClass} id='qui-suis-je'>
      <Wrapper>
        <div className={`${componentsClass}_content`}>
          <div className={`${componentsClass}_image`}>
            <Image
              src={profileImg}
              alt="Photo de profil d'Elise Collin, éducatrice canine au Café des Chiens"
              placeholder='blur'
              width={150}
              height={150}
            />
          </div>

          <div className={`${componentsClass}_text`}>
            <h3 className={`${componentsClass}_text-title`}>Qui suis-je ?</h3>
            <p className={`${componentsClass}_text-description`}>
              {`Passionnée par le monde animal depuis ma tendre enfance, je me
              suis lancée dans l'éducation canine en 2017. Depuis environ
              8 ans, je faisais du gardiennage de chiens et mon amour pour
              ceux-ci m'a conduite à chercher un travail avec eux.`}
            </p>

            <Button
              label='En savoir plus'
              color={ColorButton.SECONDARY}
              url='/education'
              className={`${componentsClass}_text-button`}
            />
          </div>
        </div>
      </Wrapper>
    </section>
  )
}

export default AboutMeHome

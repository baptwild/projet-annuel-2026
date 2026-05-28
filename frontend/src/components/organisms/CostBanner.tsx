import React from 'react'
import Image from 'next/image'
import Wrapper from '../layout/Wrapper'
import imgEqual from '../../../public/images/illustrations/equal.png'

const CostBanner: React.FC = () => {
  const componentsClass = 'o_CostBanner'

  return (
    <section className={componentsClass}>
      <Wrapper>
        <div className={`${componentsClass}_content`}>
          <div className={`${componentsClass}_image`}>
            <Image
              src={imgEqual}
              alt='Illustration équilibre et sérénité'
              priority={false}
            />
          </div>

          <div className={`${componentsClass}_text`}>
            <p className={`${componentsClass}_title`}>
              {`N'ayez plus peur pour votre canapé !`}
            </p>
            <div className={`${componentsClass}_description`}>
              <p>
                {`Emmener son chien au Café des Chiens, c'est agir malin et
                avoir l'esprit tranquille. Vous récupérerez votre animal
                heureux et apaisé !`}
              </p>
              <p>
                {`Ce moment privilégié ne pourra être que bénéfique et
                enrichissant pour votre toutou : il aura eu des échanges et fait
                des découvertes.`}
              </p>
              <p>
                {`Une solution pour éviter à votre chien de développer un trouble
                du comportement.`}
              </p>
            </div>
          </div>
        </div>
      </Wrapper>
    </section>
  )
}

export default CostBanner

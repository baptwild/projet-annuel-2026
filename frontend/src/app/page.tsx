import React from 'react'
import DaycareList from '@/components/organisms/DaycareList'
import Wrapper from '@/components/layout/Wrapper'

export default function LandingPage() {
  const componentsClass = 'p_Landing'

  return (
    <main className={componentsClass}>
      <section className={`${componentsClass}_hero`}>
        <div className={`${componentsClass}_hero-content`}>
          <h1 className={`${componentsClass}_hero-title`}>
            Trouvez la garderie canine idéale
          </h1>
          <p className={`${componentsClass}_hero-description`}>
            Une plateforme conçue pour le bien-être de vos chiens. Choisissez
            votre centre aéré, consultez les tarifs et réservez vos journées en
            toute simplicité.
          </p>
        </div>
      </section>
      <section className={`${componentsClass}_content`}>
        <div className={`${componentsClass}_content-header`}>
          <h2
            className={`${componentsClass}_content-title`}>
            Nos centres partenaires
          </h2>
          <p className={`${componentsClass}_content-description`}>
            Sélectionnez un centre pour accéder à son espace dédié
          </p>
        </div>
        <Wrapper>
          <DaycareList />
        </Wrapper>
      </section>
    </main>
  )
}

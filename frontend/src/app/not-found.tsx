import React from 'react'
import Button from '@/components/atoms/Button'
import { ColorButton } from '@/enums/ColorButton'

export default function NotFound() {
  const componentsClass = 'p_Error'

  return (
      <div className={`${componentsClass}`}>
        <h1 className={`${componentsClass}_title`}>Woof woofps...</h1>
        <h2 className={`${componentsClass}_subtitle`}>
          La page que vous cherchez semble avoir fuguée !
        </h2>
        <p className={`${componentsClass}_text`}>
          Mais pas de panique, on va vous aider à la retrouver !
        </p>
        <Button
          label="Retour à l'accueil"
          url='/'
          color={ColorButton.PRIMARY}
          className={`${componentsClass}_button`}
        />
      </div>
  )
}

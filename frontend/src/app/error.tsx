'use client'

import React, { useEffect } from 'react'
import Button from '@/components/atoms/Button'
import { ColorButton } from '@/enums/ColorButton'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  const componentsClass = 'p_ErrorPage'

  return (
      <div className={`${componentsClass}`}>
        <h1 className={`${componentsClass}_title`}>Woofps...</h1>
        <h2 className={`${componentsClass}_subtitle`}>
          Une erreur technique inattendue s&apos;est produite.
        </h2>
        <p className={`${componentsClass}_text`}>
          Nos équipes de développeurs sont sur le coup.
        </p>

        <div className={`${componentsClass}_actions`}>
          <Button
            label="Retour à l'accueil"
            url='/'
            color={ColorButton.PRIMARY}
            className={`${componentsClass}_button`}
          />
        </div>
      </div>
  )
}

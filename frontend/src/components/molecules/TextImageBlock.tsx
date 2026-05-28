'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import classNames from 'classnames'
import Button from '../atoms/Button'
import { ColorButton } from '@/enums/ColorButton'
import useMediaQuery from '@/hooks/useMediaQuery'
import { ResponsiveSize } from '@/enums/MediaQuery'

export type TextImageBlockProps = {
  title: string
  subtitle?: string
  description: React.ReactNode
  hiddenDescription?: React.ReactNode
  media: React.ReactNode
  buttonLabel?: string
  reverse?: boolean
}

const TextImageBlock: React.FC<TextImageBlockProps> = (props) => {
  const {
    title,
    subtitle,
    description,
    hiddenDescription,
    media,
    buttonLabel,
    reverse,
  } = props

  const [isExpanded, setIsExpanded] = useState(false)
  const isMobile = useMediaQuery(ResponsiveSize.SCREEN_S_MAX)

  const componentsClass = 'm_TextImageBlock'

  return (
    <div
      className={classNames(componentsClass, {
        [`${componentsClass}-reverse`]: reverse,
        [`${componentsClass}-expanded`]: isExpanded,
      })}
    >
      <div className={`${componentsClass}_content`}>
        <h3 className={`${componentsClass}_title`}>{title}</h3>
        {subtitle && (
          <h4 className={`${componentsClass}_subtitle`}>{subtitle}</h4>
        )}

        <div className={`${componentsClass}_description visible`}>
          {description}
        </div>

        {isMobile && hiddenDescription && (
          <div
            className={classNames(
              `${componentsClass}_description`,
              `${componentsClass}_expandedContent`,
              {
                visible: isExpanded,
                hidden: !isExpanded,
              },
            )}
          >
            {hiddenDescription}
          </div>
        )}

        {buttonLabel && !isExpanded && (
          <Button
            label={buttonLabel}
            color={ColorButton.PRIMARY}
            className={`${componentsClass}_button`}
            onClick={() => setIsExpanded(true)}
          />
        )}
      </div>

      <div className={`${componentsClass}_image`}>{media}</div>

      {!isMobile && hiddenDescription && (
        <div
          className={classNames(
            `${componentsClass}_description`,
            `${componentsClass}_expandedContent`,
            {
              visible: isExpanded,
              hidden: !isExpanded,
            },
          )}
        >
          {hiddenDescription}
        </div>
      )}
    </div>
  )
}

export default TextImageBlock

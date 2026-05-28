import React from 'react'
import Image, { StaticImageData } from 'next/image'

export type CardProps = {
  image: string | StaticImageData
  title: string
  description: string
}

const Card: React.FC<CardProps> = (props) => {
  const { image, title, description } = props

  const componentsClass = 'm_Card'

  return (
    <div className={componentsClass}>
      <div className={`${componentsClass}_image`}>
        <Image
          src={image}
          alt={title}
          width={400}
          height={250}
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className={`${componentsClass}_content`}>
        <h4 className={`${componentsClass}_title`}>{title}</h4>
        <p className={`${componentsClass}_description`}>{description}</p>
      </div>
    </div>
  )
}

export default Card

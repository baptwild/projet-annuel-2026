import React from 'react'
import Image, { StaticImageData } from 'next/image'
import Button from '../atoms/Button'
import { ColorButton } from '@/enums/ColorButton'

export type PriceCardProps = {
  image: StaticImageData | string
  title: string
  price: string
  description: string[]
  link: string
  label: string
}

const PriceCard: React.FC<PriceCardProps> = (props) => {
  const { image, title, price, description, link, label } = props
  const componentsClass = 'm_PriceCard'

  return (
    <div className={componentsClass}>
      <div className={`${componentsClass}_image`}>
        <Image src={image} alt={title} placeholder='blur' />
      </div>
      <div className={`${componentsClass}_content`}>
        <div className={`${componentsClass}_info`}>
          <h4 className={`${componentsClass}_title`}>{title}</h4>
          <p className={`${componentsClass}_price`}>{price}</p>
          <ul className={`${componentsClass}_list`}>
            {description.map((item, index) => (
              <li key={index} className={`${componentsClass}_item`}>
                <i className='bi bi-check-lg' />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={`${componentsClass}_footer`}>
          <Button
            label={label}
            url={link}
            color={ColorButton.PRIMARY}
            className={`${componentsClass}_button`}
          />
        </div>
      </div>
    </div>
  )
}

export default PriceCard

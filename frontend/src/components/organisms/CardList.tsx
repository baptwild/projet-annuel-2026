import React, { FC } from 'react'
import Wrapper from '../layout/Wrapper'
import Card, { CardProps } from '../molecules/Card'

export type CardListProps = {
  list: CardProps[]
}

const CardList: FC<CardListProps> = (props) => {
  const { list } = props

  const componentsClass = 'o_CardList'

  return (
    <Wrapper as='section' className={componentsClass}>
      {list.map((card, index) => (
        <Card
          key={index}
          image={card.image}
          title={card.title}
          description={card.description}
        />
      ))}
    </Wrapper>
  )
}

export default CardList

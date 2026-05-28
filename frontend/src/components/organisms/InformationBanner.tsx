import React from 'react'
import Wrapper from '../layout/Wrapper'

export type InformationBannerProps = {
  left: React.ReactNode
  right: React.ReactNode
}

const InformationBanner: React.FC<InformationBannerProps> = (props) => {
  const { left, right } = props

  const componentsClass = 'o_InformationBanner'

  return (
    <section className={componentsClass}>
      <Wrapper className={`${componentsClass}_content`}>
        <div className={`${componentsClass}_left`}>{left}</div>
        <div className={`${componentsClass}_right`}>{right}</div>
      </Wrapper>
    </section>
  )
}

export default InformationBanner

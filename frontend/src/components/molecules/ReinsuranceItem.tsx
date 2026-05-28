import React from 'react'
import classNames from 'classnames'

export type ReinsuranceItemProps = {
  icon: string
  title: string
  description: string
}

const ReinsuranceItem: React.FC<ReinsuranceItemProps> = (props) => {
  const { icon, title, description } = props

  const componentsClass = 'm_ReinsuranceItem'

  return (
    <div className={componentsClass}>
      <div className={`${componentsClass}_icon`}>
        <i className={classNames(icon)} />
      </div>
      <div className={`${componentsClass}_content`}>
        <p className={`${componentsClass}_title`}>{title}</p>
        <p className={`${componentsClass}_description`}>{description}</p>
      </div>
    </div>
  )
}

export default ReinsuranceItem

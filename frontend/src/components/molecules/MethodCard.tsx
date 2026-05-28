import React from 'react'

export type MethodCardProps = {
  icon: string
  title: string
  description: string[]
}

const MethodCard: React.FC<MethodCardProps> = (props) => {
  const { icon, title, description } = props
  const componentsClass = 'm_MethodCard'

  return (
    <div className={componentsClass}>
      <div className={`${componentsClass}_icon`}>
        <i className={icon}></i>
      </div>
      <div className={`${componentsClass}_content`}>
        <h4 className={`${componentsClass}_title`}>{title}</h4>
        <ul className={`${componentsClass}_list`}>
          {description.map((item, index) => (
            <li key={index} className={`${componentsClass}_item`}>
              <i className='bi bi-check-lg'></i>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default MethodCard

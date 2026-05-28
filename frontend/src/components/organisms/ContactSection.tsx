import React from 'react'
import Wrapper from '../layout/Wrapper'

const ContactSection: React.FC = () => {
  const componentsClass = 'o_ContactSection'

  const openingHours = [
    { day: 'Lundi', time: 'Fermé' },
    { day: 'Mardi', time: '8h - 19h' },
    { day: 'Mercredi', time: '8h - 19h' },
    { day: 'Jeudi', time: '8h - 19h' },
    { day: 'Vendredi', time: '8h - 19h' },
    { day: 'Samedi', time: 'Fermé' },
    { day: 'Dimanche', time: 'Fermé' },
  ]

  return (
    <Wrapper as='section' className={componentsClass} id='a-propos'>
      <div className={`${componentsClass}_contact`}>
        <h2 className={`${componentsClass}_contact-title`}>Éducation canine</h2>
        <h3 className={`${componentsClass}_contact-subtitle`}>
          Élise Collin - Éducatrice canine
        </h3>
        <p className={`${componentsClass}_contact-info`}>
          Grenoble et son agglomération | Isère
        </p>

        <ul className={`${componentsClass}_contact-list`}>
          <li className={`${componentsClass}_contact-item`}>
            <a
              href='tel:+33630209394'
              className={`${componentsClass}_contact-link`}
            >
              <i className='bi bi-telephone-fill' />
              <span>06 30 20 93 94</span>
            </a>
          </li>
          <li className={`${componentsClass}_contact-item`}>
            <a
              href='mailto:contact@cafedeschiens.com'
              className={`${componentsClass}_contact-link`}
            >
              <i className='bi bi-envelope-fill' />
              <span>contact@cafedeschiens.com</span>
            </a>
          </li>
        </ul>

        <div className={`${componentsClass}_contact-social`}>
          <a
            href='https://www.facebook.com/cafedeschiens'
            target='_blank'
            rel='noopener noreferrer'
            className={`${componentsClass}_contact-social-link`}
          >
            <i className='bi bi-facebook' />
          </a>
          <a
            href='https://www.instagram.com/cafedeschiens'
            target='_blank'
            rel='noopener noreferrer'
            className={`${componentsClass}_contact-social-link`}
          >
            <i className='bi bi-instagram' />
          </a>
        </div>
      </div>

      <div className={`${componentsClass}_contact`}>
        <h2 className={`${componentsClass}_contact-title`}>
          Le Café des Chiens
        </h2>
        <h3 className={`${componentsClass}_contact-subtitle`}>
          Horaires d&rsquo;ouverture
        </h3>
        <ul className={`${componentsClass}_opening-list`}>
          {openingHours.map((item) => (
            <li key={item.day} className={`${componentsClass}_opening-item`}>
              <span className={`${componentsClass}_opening-item-day`}>
                {item.day} :
              </span>
              <span className={`${componentsClass}_opening-item-time`}>
                {item.time}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Wrapper>
  )
}

export default ContactSection

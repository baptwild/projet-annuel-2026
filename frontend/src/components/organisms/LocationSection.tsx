import React from 'react'
import Image from 'next/image'
import Wrapper from '../layout/Wrapper'
import TextImageBlock from '../molecules/TextImageBlock'
import imageCentreAere from '../../../public/images/illustrations/centre-aere.webp'

const LocationSection: React.FC = () => {
  const componentsClass = 'o_LocationSection'

  return (
    <Wrapper as='section' className={componentsClass} id='localisation'>
      <TextImageBlock
        title='2000m²; pour votre chien'
        description={
          <>
            <p>
              {`2000m²; en pleine campagne, totalement clôturé et sécurisé.
              Cette grande surface permet d'organiser l'espace en
              plusieurs parties :`}
            </p>
            <ul className='m_TextImageBlock_list'>
              <li className='m_TextImageBlock_list-item'>
                <i className='bi bi-check-lg' />
                <span className='m_TextImageBlock_list-item-text'>
                  {`Un terrain d'éducation`}
                </span>
              </li>
              <li className='m_TextImageBlock_list-item'>
                <i className='bi bi-check-lg' />
                <span className='m_TextImageBlock_list-item-text'>
                  {`Un terrain de jeux`}
                </span>
              </li>
              <li className='m_TextImageBlock_list-item'>
                <i className='bi bi-check-lg' />
                <span className='m_TextImageBlock_list-item-text'>
                  {`Un espace d'accueil pour vous accueillir`}
                </span>
              </li>
              <li className='m_TextImageBlock_list-item'>
                <i className='bi bi-check-lg' />
                <span className='m_TextImageBlock_list-item-text'>
                  {`Un espace détente pour la sieste (des chiens)`}
                </span>
              </li>
            </ul>
          </>
        }
        media={
          <Image
            src={imageCentreAere}
            alt='Un espace extérieur pour votre chien'
            placeholder='blur'
          />
        }
      />

      <TextImageBlock
        reverse
        title='Localisation'
        description={
          <>
            <p>
              {`Vous pouvez venir nous voir non loin de Grenoble, derrière
              l'aérodrome du Versoud, et à côté de l'école de vol à
              voile.`}
            </p>
            <ul className='m_TextImageBlock_list'>
              <li className='m_TextImageBlock_list-item'>
                <i className='bi bi-stopwatch' />
                <span className='m_TextImageBlock_list-item-text'>
                  {`À 10 minutes d'Innovallée`}
                </span>
              </li>
              <li className='m_TextImageBlock_list-item'>
                <i className='bi bi-stopwatch' />
                <span className='m_TextImageBlock_list-item-text'>
                  {`À 15 minutes de Meylan`}
                </span>
              </li>
            </ul>
            <p className='m_TextImageBlock_additionnal'>
              Le Café des chiens
              <br />
              Rue des Brassières
              <br />
              38420 Le Versoud
            </p>
          </>
        }
        media={
          <iframe
            src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5621.018157409573!2d5.834703569775394!3d45.217268800000014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478a5ecf10367a27%3A0xe1a0bb29bfc4bc3b!2sElise%20Collin!5e0!3m2!1sfr!2sfr!4v1750710558164!5m2!1sfr!2sfr'
            width='100%'
            height='450'
            style={{ border: 0 }}
            allowFullScreen
            loading='lazy'
            referrerPolicy='no-referrer-when-downgrade'
            title='Carte interactive de localisation du Café des Chiens'
          />
        }
      />
    </Wrapper>
  )
}

export default LocationSection

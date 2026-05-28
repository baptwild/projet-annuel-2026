import React from 'react'
import Wrapper from '../layout/Wrapper'
import TextImageBlock from '../molecules/TextImageBlock'

import imageAbout1 from '../../../public/images/cours-collectifs-pour-chiens.webp'
import imageAbout2 from '../../../public/images/centre-aere-pour-chiens.webp'
import Image from 'next/image'

const AboutSection: React.FC = () => {
  const componentsClass = 'o_AboutSection'

  return (
    <Wrapper className={componentsClass} as={'section'} id='a-propos'>
      <div className={`${componentsClass}_container`}>
        <TextImageBlock
          title="Qu'est-ce que c'est ?"
          buttonLabel='Comment ça marche ?'
          media={
            <Image
              src={imageAbout1}
              alt={"Un chien qui s'amuse en extérieur"}
              placeholder='blur'
            />
          }
          description={
            <p>
              {`Le Café des Chiens est un centre aéré canin qui va vous permettre
              de laisser votre chien la journée entre les mains d’une
              professionnelle où il pourra s'amuser et bien plus encore... Fini
              le calvaire pour lui de vous attendre toute la journée. Sa bande
              de copains l’attendra avec impatience toutes les semaines.`}
            </p>
          }
          hiddenDescription={
            <>
              <p>
                {` C’est un centre qui accueille tous les chiens : petits, grands,
                jeunes, âgés, sportifs ou non. Chacun y trouvera son compte. Le
                groupe de chien reste sous ma surveillance tout au long de la
                journée. Tout le nécessaire est sur place pour subvenir à leurs
                besoins et le nombre de place est limité à une dizaine de
                congénères en même temps.​ Ils pourront s'amuser ensemble dans
                un espace qui leur sera réservé : parties de jeux garantie,
                sociabilisation assurée ! C'est en groupe que votre chien a le
                plus de chance d'évoluer dans le bon sens.`}
              </p>
              <strong>
                {`La rencontre de congénères est indispensable pour maintenir le
                bon équilibre psychologique de votre chien.`}
              </strong>
              <ul>
                <li>
                  <i className='bi bi-check-lg' />{' '}
                  <span>
                    {` Toutes les semaines votre chien sera pressé de retrouver sa
                    bande de copain et d’en rencontrer des nouveaux !`}
                  </span>
                </li>
                <li>
                  <i className='bi bi-check-lg' />{' '}
                  <span>{`Une routine à laquelle vous prendrez goût`}</span>
                </li>
                <li>
                  <i className='bi bi-check-lg' />{' '}
                  <span>
                    {` Un chien qui a ses besoins physiologiques et physiques
                    assouvit sera à votre écoute et plus réceptif pour
                    l’éducation et dans l’apprentissage de tous les jours.`}
                  </span>
                </li>

                <li>
                  <i className='bi bi-check-lg' />{' '}
                  <span>
                    {`Un apprentissage des codes canins et du comportement en
                    groupe : je suis là pour veiller à ce bon déroulement.`}
                  </span>
                </li>
              </ul>
              <p>
                {`Le chien est un animal social qui a besoin pour son bien-être et
                son équilibre de se dépenser, de faire de nouvelles rencontres,
                d’être en contact avec d’autres congénères, de découvrir de
                nouvelles odeurs : grâce à la structure du Café des chiens tous
                ces éléments sont réuni sur le terrain.`}
              </p>
              <em>
                {` Afin de limiter les risques d'accidents, je me réserve le droit
                d'entrée pour chaque chien. Vérification de la socialisation
                ainsi que toutes les mesures d'hygiène et de sécurité seront
                mises en place. Seul les chiens sains et en pleine santé
                (vaccins de la toux de chenil obligatoire et traitement
                antiparasitaire à jour) seront sélectionnés. Cet endroit sera
                idéal pour son bonheur et son plus grand plaisir.`}
              </em>
            </>
          }
        />

        <TextImageBlock
          title='Pour qui ?'
          subtitle='Le Café des Chiens est ouvert à tous'
          media={
            <Image
              src={imageAbout2}
              alt={'Trois chiens qui jouent ensemble'}
              placeholder='blur'
            />
          }
          reverse
          description={
            <>
              <p>
                {`Vous manquez de temps pour promener votre chien ? Vous voulez
                lui garantir une socialisation optimale avec ses congénères ?
                Vous avez tout simplement envie de faire plaisir à votre
                meilleur ami à 4 pattes ? Pour toutes ces raisons et d’autres
                encore, le Café des Chiens est fait pour votre compagnon.`}
              </p>
              <p className='m_TextImageBlock_additionnal'>
                {`Le Café des Chiens est ouvert à tout type de chien (à
                l'exception des chiens de catégorie 1 et 2).`}
              </p>
            </>
          }
        />
      </div>
    </Wrapper>
  )
}

export default AboutSection

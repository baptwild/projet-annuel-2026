'use client'

import React, { FormEvent, useMemo } from 'react'
import Button from '@/components/atoms/Button'
import { ColorButton } from '@/enums/ColorButton'

interface AdminThemeSectionProps {
  address: string
  setAddress: (val: string) => void
  phone: string
  setPhone: (val: string) => void
  email: string
  setEmail: (val: string) => void
  facebook: string
  setFacebook: (val: string) => void
  instagram: string
  setInstagram: (val: string) => void
  colorPrimary: string
  setColorPrimary: (val: string) => void
  colorSecondary: string
  setColorSecondary: (val: string) => void
  colorTertiary: string
  setColorTertiary: (val: string) => void
  onSubmit: (e: FormEvent) => Promise<void>
  saving: boolean
  success: boolean
  error: string | null
}

function getLuminance(hex: string): number {
  const cleanHex = hex.replace('#', '')
  const rgb = parseInt(cleanHex.length === 3 ? cleanHex.split('').map(c => c + c).join('') : cleanHex, 16)

  const r = (rgb >> 16) & 0xff
  const g = (rgb >> 8) & 0xff
  const b = (rgb >> 0) & 0xff

  const [R, G, B] = [r, g, b].map(v => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

function getContrastRatio(color1: string, color2: string): number {
  const l1 = getLuminance(color1)
  const l2 = getLuminance(color2)
  const lightest = Math.max(l1, l2)
  const darkest = Math.min(l1, l2)
  return (lightest + 0.05) / (darkest + 0.05)
}

export default function AdminThemeSection({
  address,
  setAddress,
  phone,
  setPhone,
  email,
  setEmail,
  facebook,
  setFacebook,
  instagram,
  setInstagram,
  colorPrimary,
  setColorPrimary,
  colorSecondary,
  setColorSecondary,
  colorTertiary,
  setColorTertiary,
  onSubmit,
  saving,
  success,
  error
}: AdminThemeSectionProps) {

  const primaryContrast = useMemo(() => {
    try {
      return getContrastRatio(colorPrimary || '#1D6980', '#FFFFFF')
    } catch {
      return 5
    }
  }, [colorPrimary])

  const hasContrastIssue = primaryContrast < 4.5

  const componentsClass = 'p_Admin'

  return (
    <section className={`${componentsClass}_section`}>
      <form className={`${componentsClass}_form`} onSubmit={onSubmit}>

        <h3 className={`${componentsClass}_sectionTitle`}>Informations de contact</h3>

        <div className={`${componentsClass}_field`}>
          <label className={`${componentsClass}_label`}>Adresse postale</label>
          <input className={`${componentsClass}_select`} type='text' value={address}
            onChange={e => setAddress(e.target.value)} placeholder='12 rue des Chiens, 38000 Grenoble' />
        </div>
        <div className={`${componentsClass}_field`}>
          <label className={`${componentsClass}_label`}>Téléphone</label>
          <input className={`${componentsClass}_select`} type='tel' value={phone}
            onChange={e => setPhone(e.target.value)} placeholder='01 23 45 67 89' />
        </div>
        <div className={`${componentsClass}_field`}>
          <label className={`${componentsClass}_label`}>Email de contact</label>
          <input className={`${componentsClass}_select`} type='email' value={email}
            onChange={e => setEmail(e.target.value)} placeholder='contact@garderie.fr' />
        </div>

        <div className={`${componentsClass}_divider`} />
        <h3 className={`${componentsClass}_sectionTitle`}>Réseaux sociaux</h3>

        <div className={`${componentsClass}_field`}>
          <label className={`${componentsClass}_label`}><i className='bi bi-facebook' /> Facebook</label>
          <input className={`${componentsClass}_select`} type='url' value={facebook}
            onChange={e => setFacebook(e.target.value)} placeholder='https://facebook.com/...' />
        </div>
        <div className={`${componentsClass}_field`}>
          <label className={`${componentsClass}_label`}><i className='bi bi-instagram' /> Instagram</label>
          <input className={`${componentsClass}_select`} type='url' value={instagram}
            onChange={e => setInstagram(e.target.value)} placeholder='https://instagram.com/...' />
        </div>

        <div className={`${componentsClass}_divider`} />
        <h3 className={`${componentsClass}_sectionTitle`}>Couleurs de la plateforme</h3>
        <p className={`${componentsClass}_fieldHint`}>Ces couleurs s'appliquent à l'ensemble du site. Elles sont visibles immédiatement après l'enregistrement.</p>

        <div className={`${componentsClass}_colorGrid`}>
          {([
            { label: 'Couleur primaire', value: colorPrimary, set: setColorPrimary },
            { label: 'Couleur secondaire', value: colorSecondary, set: setColorSecondary },
            { label: 'Couleur tertiaire', value: colorTertiary, set: setColorTertiary },
          ] as const).map(({ label, value, set }) => (
            <div key={label} className={`${componentsClass}_field`}>
              <label className={`${componentsClass}_label`}>{label}</label>
              <div className={`${componentsClass}_colorRow`}>
                <input type='color' className={`${componentsClass}_colorPicker`} value={value}
                  onChange={e => set(e.target.value)} />
                <input type='text' className={`${componentsClass}_select`} value={value} maxLength={7}
                  onChange={e => set(e.target.value)} placeholder='#000000' />
              </div>
            </div>
          ))}
        </div>

        <div className={`${componentsClass}_colorPreview`}>
          <span className={`${componentsClass}_colorPreviewLabel`}>Aperçu</span>
          <span className={`${componentsClass}_colorPreviewChip`} style={{ background: colorPrimary }} title='Primaire' />
          <span className={`${componentsClass}_colorPreviewChip`} style={{ background: colorSecondary }} title='Secondaire' />
          <span className={`${componentsClass}_colorPreviewChip`} style={{ background: colorTertiary }} title='Tertiaire' />
        </div>

        {hasContrastIssue && (
          <div className={`${componentsClass}_colorWarning`}>
            <i className="bi bi-exclamation-triangle-fill"></i>
            <p>
              <strong>Alerte Accessibilité :</strong> Votre couleur primaire actuelle pourrait rendre le texte blanc difficile à lire (Contraste: {primaryContrast.toFixed(1)}:1). Il est recommandé d'utiliser une couleur légèrement plus foncée.
            </p>
          </div>
        )}

        {success && <p className={`${componentsClass}_success`}>Thème mis à jour.</p>}
        {error && <p className={`${componentsClass}_error`}>{error}</p>}
        <Button
          label={saving ? 'Enregistrement...' : 'Enregistrer le thème'}
          type='submit'
          color={ColorButton.PRIMARY}
          className={`${componentsClass}_submit`}
        />
      </form>
    </section>
  )
}
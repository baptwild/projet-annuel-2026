import Link from 'next/link'
import { Daycare } from '@/types/Daycare'

const API = process.env.API_URL_INTERNAL ?? process.env.NEXT_PUBLIC_API_URL

async function fetchDaycares(): Promise<Daycare[]> {
  try {
    const res = await fetch(`${API}/api/daycares`, {
      headers: { Accept: 'application/ld+json' },
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return data['hydra:member'] ?? data['member'] ?? []
  } catch {
    return []
  }
}

export default async function DaycareList() {
  const daycares = await fetchDaycares()

  return (
    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
      {daycares.map(daycare => (
        <Link
          key={daycare.id}
          href={`/${daycare.slug}`}
          style={{
            padding: '1rem 2rem',
            border: '1px solid #1D6980',
            borderRadius: '8px',
            textDecoration: 'none',
            color: '#1D6980',
          }}
        >
          {daycare.name}
        </Link>
      ))}
      {daycares.length === 0 && <p>Aucune garderie disponible.</p>}
    </div>
  )
}

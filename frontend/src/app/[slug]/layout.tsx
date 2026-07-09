import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { DaycareProvider } from '@/hooks/useDaycare'
import { Daycare } from '@/types/Daycare'

const API = process.env.API_URL_INTERNAL ?? process.env.NEXT_PUBLIC_API_URL

async function getDaycareBySlug(slug: string): Promise<Daycare | null> {
  try {
    const res = await fetch(
      `${API}/api/daycares?slug=${encodeURIComponent(slug)}`,
      {
        headers: { Accept: 'application/ld+json' },
        cache: 'no-store',
      }
    )
    if (!res.ok) return null
    const data = await res.json()
    const members: Daycare[] = data['hydra:member'] ?? data['member'] ?? []
    return members.find(d => d.slug === slug) ?? null
  } catch (error) {
    console.error(error)
    return null
  }
}

export default async function DaycareLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const daycare = await getDaycareBySlug(slug)

  if (!daycare) notFound()

  const themeStyles = {
    '--color-primary': daycare.colorPrimary ?? '#1D6980',
    '--color-secondary': daycare.colorSecondary ?? '#01B4B8',
    '--color-tertiary': daycare.colorTertiary ?? '#2F4858',
  } as React.CSSProperties

  return (
    <DaycareProvider daycare={daycare}>
      <div style={themeStyles} className='l_TenantWrapper'>
        <Header />
        <main className='l_MainContent'>{children}</main>
        <Footer daycare={daycare} />
      </div>
    </DaycareProvider>
  )
}
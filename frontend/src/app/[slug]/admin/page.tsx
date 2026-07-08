'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useMe } from '@/hooks/useMe'
import { useAdminBookings } from '@/hooks/useAdminBookings'
import { useAdminUsers } from '@/hooks/useAdminUsers'
import { BillingMode, BillingConfig } from '@/utils/billing'
import { Section } from '@/utils/adminHelpers'
import AdminTabs from '@/components/organisms/admin/AdminTabs'
import AdminBookingSection from '@/components/organisms/admin/AdminBookingSection'
import AdminUserSection from '@/components/organisms/admin/AdminUserSection'
import AdminDogSection from '@/components/organisms/admin/AdminDogSection'
import AdminScheduleSection from '@/components/organisms/admin/AdminScheduleSection'
import AdminThemeSection from '@/components/organisms/admin/AdminThemeSection'

const API = process.env.NEXT_PUBLIC_API_URL

const DEFAULT_PRIMARY = '#1D6980'
const DEFAULT_SECONDARY = '#01B4B8'
const DEFAULT_TERTIARY = '#2F4858'

export default function AdminPage() {
  const router = useRouter()
  const params = useParams()
  const { me, loading: meLoading } = useMe()
  const { bookings, loading: bookingsLoading, updateStatus } = useAdminBookings()
  const { users, dogs, loading: usersLoading } = useAdminUsers()

  const [activeSection, setActiveSection] = useState<Section>('bookings')

  const [daycareId, setDaycareId] = useState<number | null>(null)
  const [openingTime, setOpeningTime] = useState('')
  const [closingTime, setClosingTime] = useState('')
  const [openDays, setOpenDays] = useState<number[]>([1, 2, 3, 4, 5])
  const [billingMode, setBillingMode] = useState<BillingMode>('hourly')
  const [pricePerUnit, setPricePerUnit] = useState<number>(0)
  const [priceHalfDay, setPriceHalfDay] = useState<number>(0)
  const [tierEnabled, setTierEnabled] = useState(false)
  const [tierHoursThreshold, setTierHoursThreshold] = useState<number>(4)
  const [tierPrice, setTierPrice] = useState<number>(0)
  const [weeklyDiscountEnabled, setWeeklyDiscountEnabled] = useState(false)
  const [weeklyDiscountThreshold, setWeeklyDiscountThreshold] = useState(3)
  const [weeklyDiscountPercent, setWeeklyDiscountPercent] = useState<number>(10)
  const [maxDogsPerDay, setMaxDogsPerDay] = useState<number | null>(null)
  const [scheduleSuccess, setScheduleSuccess] = useState(false)
  const [scheduleError, setScheduleError] = useState<string | null>(null)
  const [scheduleSaving, setScheduleSaving] = useState(false)

  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [facebook, setFacebook] = useState('')
  const [instagram, setInstagram] = useState('')
  const [colorPrimary, setColorPrimary] = useState(DEFAULT_PRIMARY)
  const [colorSecondary, setColorSecondary] = useState(DEFAULT_SECONDARY)
  const [colorTertiary, setColorTertiary] = useState(DEFAULT_TERTIARY)
  const [themeSuccess, setThemeSuccess] = useState(false)
  const [themeError, setThemeError] = useState<string | null>(null)
  const [themeSaving, setThemeSaving] = useState(false)

  useEffect(() => {
    if (meLoading) return
    if (!me) {
      router.push(`/${params.slug}/login`)
      return
    }
    if (!me.roles.includes('ROLE_ADMIN')) {
      router.push(`/${params.slug}`)
      return
    }
    if (me.daycare?.slug !== params.slug) {
      console.warn("Accès refusé: Vous n'êtes pas l'administrateur de cet établissement !")
      router.push(`/${me.daycare.slug}/admin`)
      return
    }
  }, [meLoading, me, router, params.slug])

  useEffect(() => {
    if (!me) return
    const d = me.daycare
    setDaycareId(d.id)
    setOpeningTime(d.openingTime)
    setClosingTime(d.closingTime)
    setOpenDays(d.openDays ?? [1, 2, 3, 4, 5])
    setBillingMode((d.billingMode as BillingMode) ?? 'hourly')
    setPricePerUnit(d.pricePerUnit ?? 0)
    setPriceHalfDay(d.priceHalfDay ?? 0)
    setTierEnabled(d.tierHoursThreshold != null)
    setTierHoursThreshold(d.tierHoursThreshold ?? 4)
    setTierPrice(d.tierPrice ?? 0)
    setWeeklyDiscountEnabled(d.weeklyDiscountEnabled ?? false)
    setWeeklyDiscountThreshold(d.weeklyDiscountThreshold ?? 3)
    setWeeklyDiscountPercent(d.weeklyDiscountPercent ?? 10)
    setMaxDogsPerDay(d.maxDogsPerDay ?? null)
    setAddress(d.address ?? '')
    setPhone(d.phone ?? '')
    setEmail(d.email ?? '')
    setFacebook(d.facebook ?? '')
    setInstagram(d.instagram ?? '')
    setColorPrimary(d.colorPrimary ?? DEFAULT_PRIMARY)
    setColorSecondary(d.colorSecondary ?? DEFAULT_SECONDARY)
    setColorTertiary(d.colorTertiary ?? DEFAULT_TERTIARY)
  }, [me])

  const handleScheduleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!daycareId) return
    setScheduleSaving(true)
    setScheduleSuccess(false)
    setScheduleError(null)
    const token = localStorage.getItem('token')
    const res = await fetch(`${API}/api/daycares/${daycareId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/merge-patch+json' },
      body: JSON.stringify({
        openingTime, closingTime, openDays, billingMode, pricePerUnit, priceHalfDay,
        tierHoursThreshold: tierEnabled ? tierHoursThreshold : null,
        tierPrice: tierEnabled ? tierPrice : null,
        weeklyDiscountEnabled, weeklyDiscountThreshold, weeklyDiscountPercent, maxDogsPerDay,
      }),
    })
    setScheduleSaving(false)
    if (res.ok) {
      setScheduleSuccess(true)
      router.refresh()
    }
    else setScheduleError('Erreur lors de la mise à jour.')
  }

  const handleThemeSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!daycareId) return
    setThemeSaving(true)
    setThemeSuccess(false)
    setThemeError(null)
    const token = localStorage.getItem('token')
    const res = await fetch(`${API}/api/daycares/${daycareId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/merge-patch+json' },
      body: JSON.stringify({
        address, phone, email, facebook, instagram, colorPrimary, colorSecondary, colorTertiary,
      }),
    })
    setThemeSaving(false)
    if (res.ok) {
      setThemeSuccess(true)
      const root = document.documentElement
      root.style.setProperty('--color-primary', colorPrimary)
      root.style.setProperty('--color-secondary', colorSecondary)
      root.style.setProperty('--color-tertiary', colorTertiary)
      router.refresh()
    } else {
      setThemeError('Erreur lors de la mise à jour.')
    }
  }

  const billingConfig: BillingConfig = {
    billingMode, pricePerUnit, priceHalfDay,
    tierHoursThreshold: tierEnabled ? tierHoursThreshold : null,
    tierPrice: tierEnabled ? tierPrice : null,
    weeklyDiscountEnabled, weeklyDiscountThreshold, weeklyDiscountPercent,
  }

  const componentsClass = 'p_Admin'

  if (meLoading) return <div className={`${componentsClass} ${componentsClass}-loading`}>Chargement...</div>
  if (!me) return null

  const pendingCount = bookings.filter(b => b.status === 'pending').length

  return (
    <div className={componentsClass}>
      <div className={`${componentsClass}_header`}>
        <h1 className={`${componentsClass}_title`}>Administration</h1>
        <p className={`${componentsClass}_daycare`}>{me.daycare.name}</p>
      </div>

      <AdminTabs
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        pendingCount={pendingCount}
      />

      {activeSection === 'bookings' && (
        <AdminBookingSection
          bookings={bookings}
          loading={bookingsLoading}
          updateStatus={updateStatus}
          billingConfig={billingConfig}
          openDays={openDays}
        />
      )}

      {activeSection === 'users' && (
        <AdminUserSection
          users={users}
          dogs={dogs}
          loading={usersLoading}
        />
      )}

      {activeSection === 'dogs' && (
        <AdminDogSection
          dogs={dogs}
          users={users}
          loading={usersLoading}
        />
      )}

      {activeSection === 'schedule' && (
        <AdminScheduleSection
          openingTime={openingTime}
          setOpeningTime={setOpeningTime}
          closingTime={closingTime}
          setClosingTime={setClosingTime}
          openDays={openDays}
          setOpenDays={setOpenDays}
          billingMode={billingMode}
          setBillingMode={setBillingMode}
          pricePerUnit={pricePerUnit}
          setPricePerUnit={setPricePerUnit}
          priceHalfDay={priceHalfDay}
          setPriceHalfDay={setPriceHalfDay}
          tierEnabled={tierEnabled}
          setTierEnabled={setTierEnabled}
          tierHoursThreshold={tierHoursThreshold}
          setTierHoursThreshold={setTierHoursThreshold}
          tierPrice={tierPrice}
          setTierPrice={setTierPrice}
          weeklyDiscountEnabled={weeklyDiscountEnabled}
          setWeeklyDiscountEnabled={setWeeklyDiscountEnabled}
          weeklyDiscountThreshold={weeklyDiscountThreshold}
          setWeeklyDiscountThreshold={setWeeklyDiscountThreshold}
          weeklyDiscountPercent={weeklyDiscountPercent}
          setWeeklyDiscountPercent={setWeeklyDiscountPercent}
          maxDogsPerDay={maxDogsPerDay}
          setMaxDogsPerDay={setMaxDogsPerDay}
          onSubmit={handleScheduleSubmit}
          saving={scheduleSaving}
          success={scheduleSuccess}
          error={scheduleError}
        />
      )}

      {activeSection === 'theme' && (
        <AdminThemeSection
          address={address}
          setAddress={setAddress}
          phone={phone}
          setPhone={setPhone}
          email={email}
          setEmail={setEmail}
          facebook={facebook}
          setFacebook={setFacebook}
          instagram={instagram}
          setInstagram={setInstagram}
          colorPrimary={colorPrimary}
          setColorPrimary={setColorPrimary}
          colorSecondary={colorSecondary}
          setColorSecondary={setColorSecondary}
          colorTertiary={colorTertiary}
          setColorTertiary={setColorTertiary}
          onSubmit={handleThemeSubmit}
          saving={themeSaving}
          success={themeSuccess}
          error={themeError}
        />
      )}
    </div>
  )
}
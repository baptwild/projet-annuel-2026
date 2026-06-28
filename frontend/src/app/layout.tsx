import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import localFont from 'next/font/local'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { AuthProvider } from '@/hooks/useAuth'

import '../../sass/main.scss'

const roboto = Roboto({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
})

const bellerose = localFont({
  src: '../../public/fonts/bellerose/Bellerose.woff2',
  variable: '--font-bellerose',
})

export const metadata: Metadata = {
  title: 'Le Café des Chiens',
  description: 'Votre centre aéré canin.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang='fr' className={`${roboto.variable} ${bellerose.variable}`}>
      <body>
        <AuthProvider>
          <Header />
          <div id='modal' className='m_Modal'></div>
          <main className='l_MainContent'>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}

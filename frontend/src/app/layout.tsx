import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import localFont from 'next/font/local'
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
  title: 'Votre solution pour gérer votre centre aéré canin !',
  description: 'Votre centre aéré canin.',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='fr' className={`${roboto.variable} ${bellerose.variable}`}>
      <body>
        <AuthProvider>
          <div id='modal' className='m_Modal'></div>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
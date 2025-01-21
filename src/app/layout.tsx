import '@/styles/globals.css'

import { type Metadata } from 'next'
import { TRPCReactProvider } from '@/trpc/react'
import { GeistSans } from 'geist/font/sans'
import { SessionProvider } from 'next-auth/react'

import { HackathonBanner } from './_components/hackathon-banner'

export const metadata: Metadata = {
  title: 'HoodGoods',
  description: "Finding Charming Goods in 'Hoods",
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <HackathonBanner />
        <SessionProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  )
}

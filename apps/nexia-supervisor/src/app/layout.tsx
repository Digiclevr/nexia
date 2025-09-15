import './globals.css'
import { Inter } from 'next/font/google'
import ClientLayout from './client-layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'NEXIA - Meta-Orchestrateur IA',
  description: 'Supervision Intelligente Multi-Écosystème avec Interface Vocale',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
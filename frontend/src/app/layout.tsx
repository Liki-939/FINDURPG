import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FINDURPG - Premium Accommodations',
  description: 'FINDURPG provides premium temporary living structures and co-living experiences.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen relative overflow-x-hidden pt-20`}>
        {/* Background glow effects */}
        <div className="fixed inset-0 z-[-1] bg-background pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[120px]" />
        </div>
        
        <Navbar />
        <main className="w-full relative z-10 flex min-h-[calc(100vh-80px)] flex-col items-center justify-center p-4">
          {children}
        </main>
      </body>
    </html>
  )
}

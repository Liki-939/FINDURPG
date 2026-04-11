import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import "./globals.css";
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var theme = localStorage.getItem('theme');
              if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              }
            } catch (e) {}
          })();
        ` }} />
      </head>
      <body className={`${inter.className} min-h-screen relative overflow-x-hidden pt-20 bg-background text-foreground transition-colors duration-300`}>
        {/* Background glow effects - Adaptive */}
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 dark:bg-primary/20 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/5 dark:bg-accent/10 blur-[120px]" />
        </div>
        
        <Navbar />
        <main className="w-full relative z-10 flex min-h-[calc(100vh-80px)] flex-col items-center p-4">
          {children}
        </main>
      </body>
    </html>
  )
}

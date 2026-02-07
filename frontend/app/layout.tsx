import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono, Space_Grotesk, Inter } from 'next/font/google'

import './globals.css'
import Footer from '@/components/footer'

const geist = Geist({ subsets: ['latin'] })
const geistMono = Geist_Mono({ subsets: ['latin'] })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['500', '600', '700'] })
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Study.Sync - AI-Powered Learning',
  description: 'Transform YouTube videos into structured notes, flashcards, and quizzes with AI',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.className}`}>
      <body className="font-sans antialiased text-foreground min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}

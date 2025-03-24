import React from 'react'
import { AuthProvider } from '../providers/auth-provider'
import { ThemeProvider } from '../providers/theme-provider'
import Footer from './footer'
import MainHeader from './main-header'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="flex min-h-screen flex-col">
          <MainHeader />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
} 
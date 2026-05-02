import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/sonner' // Shadcn bildirimleri için şart
import './globals.css'

export const metadata: Metadata = {
  title: 'AlphaEye | Pro-Grade Token Guard',
  description: 'Real-time Solana token security scanner',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <body
        className="font-sans antialiased min-h-screen bg-background text-foreground"
      >
        {/* Ana İçerik */}
        {children}
        
        {/* Sağ alt köşede şık bildirimler (Cüzdan kopyalama vb. için) */}
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}
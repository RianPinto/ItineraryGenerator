import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import type { ReactNode } from "react"
import { Suspense } from "react"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} main-surface min-h-screen flex flex-col`}>
        {/* Header is provided by the Navbar component inside pages */}
        <Suspense fallback={<div>Loading...</div>}>
          <main className="flex-1 min-h-screen flex flex-col">{children}</main>
        </Suspense>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  )
}

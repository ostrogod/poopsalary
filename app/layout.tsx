import type React from "react"
import type { Metadata } from "next"
import { Nunito, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "./context/auth-context"
import { LanguageProvider } from "./context/language-context"
import { Sidebar } from "./components/sidebar"
import "./globals.css"

const _nunito = Nunito({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Poop Salary 💩",
  description: "Descubre cuánto ganas mientras haces tus necesidades",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${_nunito.className}`}>
        <LanguageProvider>
          <AuthProvider>
            <div className="flex">
              <Sidebar />
              <div className="flex-1">
                {children}
                <Analytics />
              </div>
            </div>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}

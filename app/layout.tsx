import type React from "react"
import type { Metadata } from "next"
import { Cinzel, Lora } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { PrivacyProvider } from "@/contexts/privacy-context"

// Load fonts using Next.js font system
const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lora",
})

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cinzel",
})

export const metadata: Metadata = {
  title: "D&D Character Creator",
  description: "Create your Dungeons & Dragons 5e character with a Baldur's Gate inspired UI",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="preload" href="/images/bg3-background.jpg" as="image" />
        <link rel="preload" href="/images/bg3-glyph1.png" as="image" />
        <link rel="preload" href="/images/bg3-glyph2.png" as="image" />
        <link rel="preload" href="/images/bg3-panel-texture.jpg" as="image" />
        {/* Preload cursor images for better performance */}
        <link rel="preload" href="/images/bg3-cursor.png" as="image" />
        <link rel="preload" href="/images/bg3-cursor-select.png" as="image" />
        <link rel="preload" href="/images/bg3-cursor-text.png" as="image" />
      </head>
      <body className={`${lora.variable} ${cinzel.variable}`}>
        <PrivacyProvider>
          <ThemeProvider attribute="class" defaultTheme="dark">
            {children}
          </ThemeProvider>
        </PrivacyProvider>
      </body>
    </html>
  )
}

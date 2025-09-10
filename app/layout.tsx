import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Dashboard - Modern Admin Panel",
  description: "A clean and modern dashboard built with Next.js 14, shadcn/ui, and Tailwind CSS.",
  keywords: [
    "dashboard",
    "admin panel",
    "Next.js 14",
    "shadcn/ui",
    "Tailwind CSS",
    "React dashboard",
    "modern UI",
    "responsive design",
    "TypeScript",
  ],
  authors: [{ name: "Dashboard" }],
  creator: "Dashboard",
  publisher: "Dashboard",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Dashboard - Modern Admin Panel",
    description: "A clean and modern dashboard built with Next.js 14, shadcn/ui, and Tailwind CSS.",
    siteName: "Dashboard",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
  classification: "Dashboard",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className} suppressHydrationWarning>{children}</body>
    </html>
  )
}

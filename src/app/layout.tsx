import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "./ClientLayout"
import ServiceWorkerProvider from "@/components/ServiceWorkerProvider"

import "./globals.css"

export const metadata: Metadata = {
  title: "Bon Ga Restaurant - Authentic Korean Cuisine",
  description:
    "Experience authentic Korean flavors at Bon Ga Restaurant. Traditional dishes with a modern twist, made with the finest ingredients.",
  manifest: "/manifest.json",

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Bon Ga",
  },
  icons: {
    apple: "/icon512_rounded.png",
    icon: "/icon512_rounded.png",
  },
}

export const viewport = {
  themeColor: "#3d5a3d",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head></head>
      <body>
        <ServiceWorkerProvider />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}

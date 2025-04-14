import type { Metadata } from "next"
import { Providers } from "./components/providers"
import { Toaster } from "react-hot-toast"

import "./globals.css"

export const metadata: Metadata = {
  title: "JStack App",
  description: "Created using JStack",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased h-full bg-brand-50">
      
        <Providers>
      
          {children}
          <Toaster
          position="bottom-right" 
          />
          </Providers>
      </body>
    </html>
  )
}

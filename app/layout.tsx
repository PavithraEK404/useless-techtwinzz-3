import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Meme Generator",
  description: "Generate hilarious memes using AI - just describe your idea and let AI create the perfect meme!",
  keywords: ["meme", "generator", "AI", "funny", "social media"],
  authors: [{ name: "AI Meme Generator" }],
  openGraph: {
    title: "AI Meme Generator",
    description: "Generate hilarious memes using AI",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}

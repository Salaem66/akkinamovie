import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import UpdatePrompt from "./components/UpdatePrompt"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PickMe",
  description: "Trouvez le film parfait pour votre soirée",
  icons: {
    icon: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icon192.jpg-eoCCKxb4ZMiCdrIgvVB49P88271W9P.jpeg",
        sizes: "192x192",
        type: "image/jpeg",
      },
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icon512.jpg-xgWtvLdkwO8fOe6XPLOlfm7TbARn6u.jpeg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
    apple: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icon192.jpg-eoCCKxb4ZMiCdrIgvVB49P88271W9P.jpeg",
      },
    ],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {children}
        <UpdatePrompt />
      </body>
    </html>
  )
}



import './globals.css'
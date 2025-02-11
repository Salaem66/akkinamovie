import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PickMe",
    short_name: "PickMe",
    description: "Trouvez le film parfait pour votre soirée",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icon192.jpg-eoCCKxb4ZMiCdrIgvVB49P88271W9P.jpeg",
        sizes: "192x192",
        type: "image/jpeg",
      },
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icon512.jpg-xgWtvLdkwO8fOe6XPLOlfm7TbARn6u.jpeg",
        sizes: "512x512",
        type: "image/jpeg",
      },
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icon512.jpg-xgWtvLdkwO8fOe6XPLOlfm7TbARn6u.jpeg",
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "maskable",
      },
    ],
  }
}


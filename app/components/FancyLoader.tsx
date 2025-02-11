import React, { useState, useEffect } from "react"
import { Film } from "lucide-react"

const loadingMessages = [
  "Je cherche le film parfait pour toi...",
  "Analyse de tes préférences en cours...",
  "Exploration des chefs-d'œuvre du cinéma...",
  "Préparation du pop-corn virtuel...",
  "Déroulement du tapis rouge...",
]

export default function FancyLoader() {
  const [message, setMessage] = useState(loadingMessages[0])

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)])
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-4">
      <div className="relative w-16 h-16 sm:w-24 sm:h-24 animate-spin">
        <Film className="w-full h-full text-primary" />
        <div className="absolute top-0 left-0 w-full h-full border-4 border-dashed border-primary rounded-full animate-spin-slow"></div>
      </div>
      <p className="text-base sm:text-lg font-medium text-primary animate-pulse text-center">{message}</p>
    </div>
  )
}


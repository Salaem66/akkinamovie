"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function UpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    let refreshing = false

    const checkForUpdates = async () => {
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.ready
        registration.update().then(() => {
          console.log("Service Worker updated")
          setShowPrompt(true)
        })
      }
    }

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return
      refreshing = true
      console.log("Controller changed, refreshing...")
      window.location.reload()
    })

    checkForUpdates()
    const interval = setInterval(checkForUpdates, 60 * 1000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  const handleUpdate = () => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: "SKIP_WAITING" })
    }
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg z-50">
      <p className="mb-2">Une mise à jour est disponible !</p>
      <Button onClick={handleUpdate}>Mettre à jour maintenant</Button>
    </div>
  )
}


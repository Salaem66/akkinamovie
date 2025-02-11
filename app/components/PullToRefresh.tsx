import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { ArrowDownCircle } from "lucide-react"

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({ onRefresh, children }) => {
  const [startY, setStartY] = useState<number | null>(null)
  const [pulling, setPulling] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].pageY)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY !== null) {
      const currentY = e.touches[0].pageY
      const diff = currentY - startY
      if (diff > 100 && diff < 200) {
        setPulling(true)
      } else {
        setPulling(false)
      }
    }
  }

  const handleTouchEnd = useCallback(async () => {
    if (pulling && !refreshing) {
      setRefreshing(true)
      setPulling(false)
      try {
        await onRefresh()
      } catch (error) {
        console.error("Error during refresh:", error)
      } finally {
        setRefreshing(false)
      }
    }
    setStartY(null)
    setPulling(false)
  }, [pulling, refreshing, onRefresh])

  useEffect(() => {
    document.body.style.overscrollBehavior = "contain"
    return () => {
      document.body.style.overscrollBehavior = "auto"
    }
  }, [])

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="min-h-screen relative"
    >
      <div
        className={`absolute top-0 left-0 right-0 flex items-center justify-center transition-transform duration-300 ${
          pulling || refreshing ? "translate-y-16" : "-translate-y-16"
        }`}
        aria-hidden="true"
      >
        <ArrowDownCircle className={`h-8 w-8 text-primary ${refreshing ? "animate-spin" : ""}`} />
      </div>
      {children}
    </div>
  )
}

export default PullToRefresh


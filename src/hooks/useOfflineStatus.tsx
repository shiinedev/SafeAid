
import { useState, useEffect } from "react"

export function useOfflineStatus() {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    // Set initial status
    setIsOffline(!navigator.onLine)

    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return isOffline
}

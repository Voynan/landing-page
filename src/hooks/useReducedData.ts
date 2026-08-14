import { useEffect, useState } from "react"

type NavigatorWithConnection = Navigator & {
  connection?: EventTarget & { saveData?: boolean }
}

function readsReducedDataPreference() {
  if (typeof window === "undefined") {
    return false
  }

  const connection = (window.navigator as NavigatorWithConnection).connection
  const mediaQuery = window.matchMedia?.("(prefers-reduced-data: reduce)")

  return Boolean(connection?.saveData || mediaQuery?.matches)
}

export function useReducedData() {
  const [reducedData, setReducedData] = useState(readsReducedDataPreference)

  useEffect(() => {
    const connection = (window.navigator as NavigatorWithConnection).connection
    const mediaQuery = window.matchMedia?.("(prefers-reduced-data: reduce)")
    const updatePreference = () => setReducedData(readsReducedDataPreference())

    connection?.addEventListener("change", updatePreference)
    mediaQuery?.addEventListener("change", updatePreference)

    return () => {
      connection?.removeEventListener("change", updatePreference)
      mediaQuery?.removeEventListener("change", updatePreference)
    }
  }, [])

  return reducedData
}

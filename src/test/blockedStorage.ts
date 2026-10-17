// Simulates a browser that refuses storage access, as Safari private browsing
// and hardened privacy settings do: reading window.localStorage throws. Spying
// on getItem or setItem is not enough, because jsdom's real Storage ignores
// replaced methods, so such a test passes or fails depending on the runtime.
export function blockLocalStorage(): () => void {
  const original = Object.getOwnPropertyDescriptor(window, "localStorage")

  Object.defineProperty(window, "localStorage", {
    configurable: true,
    get() {
      throw new DOMException("Storage is blocked", "SecurityError")
    },
  })

  return () => {
    if (original) {
      Object.defineProperty(window, "localStorage", original)
    } else {
      delete (window as { localStorage?: Storage }).localStorage
    }
  }
}

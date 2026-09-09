import type { AntispamTokenAdapter } from "@/app/contactRuntimeContext"

export const antispamSlotAttribute = "data-antispam-slot"

const scriptSrc =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"

type TurnstileRenderOptions = {
  sitekey: string
  execution: "execute"
  appearance: "interaction-only"
  callback: (token: string) => void
  "error-callback": () => void
  "timeout-callback": () => void
}

type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string
  execute: (widgetId: string) => void
  reset: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile)

  return new Promise((resolve, reject) => {
    const script = document.createElement("script")

    script.src = scriptSrc
    script.async = true
    script.addEventListener("load", () => {
      if (window.turnstile) resolve(window.turnstile)
      else reject(new Error("Turnstile loaded without exposing its API"))
    })
    script.addEventListener("error", () =>
      reject(new Error("Turnstile failed to load")),
    )

    document.head.append(script)
  })
}

// The adapter touches the DOM only when it is called, never when it is
// created, so it can be built during a server render without breaking
// hydration.
export function createAntispamAdapter(
  siteKey: string | undefined,
): AntispamTokenAdapter | undefined {
  if (!siteKey) return undefined

  let widget: { api: TurnstileApi; id: string } | null = null
  let settle: {
    resolve: (token: string) => void
    reject: (error: Error) => void
  } | null = null

  const takeSettle = () => {
    const current = settle
    settle = null
    return current
  }

  return async function requestAntispamToken() {
    const container = document.querySelector<HTMLElement>(
      `[${antispamSlotAttribute}]`,
    )

    if (!container) {
      throw new Error("The antispam slot is not rendered")
    }

    if (widget) {
      // A Turnstile token is single-use, so a second submission needs a fresh
      // challenge rather than a second widget.
      widget.api.reset(widget.id)
    } else {
      const api = await loadTurnstile()
      const id = api.render(container, {
        sitekey: siteKey,
        execution: "execute",
        appearance: "interaction-only",
        callback: (token) => takeSettle()?.resolve(token),
        "error-callback": () =>
          takeSettle()?.reject(new Error("Turnstile refused the request")),
        "timeout-callback": () =>
          takeSettle()?.reject(new Error("Turnstile timed out")),
      })

      widget = { api, id }
    }

    return new Promise<string>((resolve, reject) => {
      settle = { resolve, reject }
      widget?.api.execute(widget.id)
    })
  }
}

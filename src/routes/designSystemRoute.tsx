import { lazy, Suspense } from "react"

const LazyDesignSystemPage = lazy(async () => {
  const module = await import("@/pages/design-system/DesignSystemPage")

  return { default: module.DesignSystemPage }
})

export function DesignSystemRoute() {
  return (
    <Suspense
      fallback={
        <main id="main-content" className="ds-route-loading">
          <p>Loading design system…</p>
        </main>
      }
    >
      <LazyDesignSystemPage />
    </Suspense>
  )
}

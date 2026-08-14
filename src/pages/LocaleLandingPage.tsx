import { AppProviders } from "@/app/AppProviders"
import type { PublicLocale } from "@/utils/rootLocale"

type LocaleLandingPageProps = {
  locale: PublicLocale
}

export function LocaleLandingPage({ locale }: LocaleLandingPageProps) {
  return (
    <AppProviders locale={locale}>
      <main id="main-content" data-locale={locale}>
        <h1>Voynan</h1>
      </main>
    </AppProviders>
  )
}

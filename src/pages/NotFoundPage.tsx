import { useTranslation } from "react-i18next"

export function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <main id="main-content">
      <h1>{t("notFound.title")}</h1>
      <p>{t("notFound.description")}</p>
      <a href="/">{t("notFound.backLabel")}</a>
    </main>
  )
}

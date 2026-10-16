import { useAnalyticsConsent } from "@/app/analyticsConsentContext"
import { cn } from "@/lib/utils"

type CookiePreferencesButtonProps = {
  label: string
  className?: string
}

export function CookiePreferencesButton({
  label,
  className,
}: CookiePreferencesButtonProps) {
  const { reopen } = useAnalyticsConsent()

  return (
    <button
      type="button"
      className={cn("cookie-preferences-button", className)}
      onClick={(event) => reopen(event.currentTarget)}
    >
      {label}
    </button>
  )
}

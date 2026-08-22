import { Button } from "@/components/ui/button"

type CTAAction = {
  href: string
  label: string
  onClick?: () => void
  variant?: "default" | "outline"
}

type CTAGroupProps = {
  actions: readonly [CTAAction, CTAAction]
}

export function CTAGroup({ actions }: CTAGroupProps) {
  return (
    <div className="landing-cta-group">
      {actions.map((action) => (
        <Button
          asChild
          key={action.href}
          size="lg"
          variant={action.variant ?? "default"}
        >
          <a href={action.href} onClick={action.onClick}>
            {action.label}
          </a>
        </Button>
      ))}
    </div>
  )
}

export type { CTAAction, CTAGroupProps }

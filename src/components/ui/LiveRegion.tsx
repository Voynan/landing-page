import type { HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

type LiveRegionPoliteness = "polite" | "assertive"

type LiveRegionProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "aria-atomic" | "aria-live" | "children" | "role"
> & {
  message: string
  politeness?: LiveRegionPoliteness
}

function LiveRegion({
  message,
  politeness = "polite",
  className,
  ...props
}: LiveRegionProps) {
  return (
    <div
      {...props}
      role={politeness === "assertive" ? "alert" : "status"}
      aria-atomic="true"
      aria-live={politeness}
      className={cn("text-sm text-muted-foreground", className)}
    >
      {message}
    </div>
  )
}

export { LiveRegion }
export type { LiveRegionPoliteness, LiveRegionProps }

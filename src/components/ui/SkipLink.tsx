import type { AnchorHTMLAttributes } from "react"

import { cn } from "@/lib/utils"

type SkipLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  targetId: string
}

function SkipLink({
  targetId,
  children = "Pular para o conteúdo",
  className,
  ...props
}: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        "fixed start-5 top-5 z-50 inline-flex min-h-11 -translate-y-24 items-center rounded-sm bg-primary px-5 font-medium text-primary-foreground transition-transform duration-[var(--duration-hover)] ease-[var(--ease-enter)] focus-visible:translate-y-0 motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      {children}
    </a>
  )
}

export { SkipLink }
export type { SkipLinkProps }

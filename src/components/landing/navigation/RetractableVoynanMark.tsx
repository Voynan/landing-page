import voynanIcon from "@/assets/brand/voynan.svg"
import voynanWordmark from "@/assets/brand/voynan-wordmark.svg"

type RetractableVoynanMarkProps = {
  collapsed: boolean
  label: string
}

export function RetractableVoynanMark({
  collapsed,
  label,
}: RetractableVoynanMarkProps) {
  return (
    <a
      className="retractable-mark"
      href="#hero"
      aria-label={label}
      data-collapsed={collapsed}
    >
      <img
        className="retractable-mark__wordmark"
        src={voynanWordmark}
        alt=""
        width="300"
        height="120"
      />
      <img
        className="retractable-mark__icon"
        src={voynanIcon}
        alt=""
        width="100"
        height="100"
      />
    </a>
  )
}

export type { RetractableVoynanMarkProps }

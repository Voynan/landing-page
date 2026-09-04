const eclipseStates = [
  "ring",
  "line",
  "orbit",
  "flow",
  "code",
  "signature",
  "closing-ring",
] as const

type EclipseState = (typeof eclipseStates)[number]

export { eclipseStates }
export type { EclipseState }

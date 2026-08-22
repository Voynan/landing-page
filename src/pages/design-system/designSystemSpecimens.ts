export type DesignSystemSpecimenId =
  | "foundations"
  | "typography"
  | "layout"
  | "controls"
  | "content-stress"
  | "media"
  | "motion"
  | "accessibility"
  | "forms"

export const foundationalSpecimens: ReadonlyArray<{
  id: DesignSystemSpecimenId
  label: string
}> = [
  { id: "foundations", label: "Foundations" },
  { id: "typography", label: "Typography" },
  { id: "layout", label: "Layout" },
  { id: "controls", label: "Controls" },
  { id: "content-stress", label: "Content stress" },
  { id: "media", label: "Media" },
  { id: "motion", label: "Motion" },
  { id: "accessibility", label: "Accessibility" },
  { id: "forms", label: "Forms" },
]

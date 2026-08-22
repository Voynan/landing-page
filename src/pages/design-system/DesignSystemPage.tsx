import { SkipLink } from "@/components/ui/SkipLink"
import { DesignSystemHead } from "@/pages/design-system/DesignSystemHead"
import { DesignSystemNav } from "@/pages/design-system/DesignSystemNav"
import { AccessibilitySpecimen } from "@/pages/design-system/specimens/AccessibilitySpecimen"
import { ContentStressSpecimen } from "@/pages/design-system/specimens/ContentStressSpecimen"
import { ControlsSpecimen } from "@/pages/design-system/specimens/ControlsSpecimen"
import { FoundationsSpecimen } from "@/pages/design-system/specimens/FoundationsSpecimen"
import { FormsSpecimen } from "@/pages/design-system/specimens/FormsSpecimen"
import { LayoutSpecimen } from "@/pages/design-system/specimens/LayoutSpecimen"
import { MediaSpecimen } from "@/pages/design-system/specimens/MediaSpecimen"
import { MotionSpecimen } from "@/pages/design-system/specimens/MotionSpecimen"
import { TypographySpecimen } from "@/pages/design-system/specimens/TypographySpecimen"

export function DesignSystemPage() {
  return (
    <>
      <DesignSystemHead />
      <div className="ds-page">
        <SkipLink targetId="main-content" />
        <header className="ds-header">
          <div className="ds-shell">
            <h1>Voynan Design System</h1>
          </div>
        </header>

        <div className="ds-shell ds-shell--nav">
          <DesignSystemNav />
        </div>

        <main id="main-content" className="ds-shell ds-main">
          <FoundationsSpecimen />
          <TypographySpecimen />
          <LayoutSpecimen />
          <ControlsSpecimen />
          <ContentStressSpecimen />
          <MediaSpecimen />
          <MotionSpecimen />
          <AccessibilitySpecimen />
          <FormsSpecimen />
        </main>
      </div>
    </>
  )
}

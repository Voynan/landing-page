import { Button } from "@/components/ui/button"
import { CTAGroup } from "@/components/landing/hero/CTAGroup"
import { LanguageSwitch } from "@/components/landing/navigation/LanguageSwitch"
import { CompactNavigationMenu } from "@/components/landing/navigation/ProgressiveNav"
import { Label } from "@/components/ui/label"
import { LiveRegion } from "@/components/ui/LiveRegion"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SkipLink } from "@/components/ui/SkipLink"

export function ControlsSpecimen() {
  return (
    <section
      id="controls"
      className="ds-specimen"
      aria-labelledby="controls-heading"
    >
      <header className="ds-specimen__header">
        <h2 id="controls-heading">Controls</h2>
        <p>
          Every state below is rendered by the production primitive. The bench
          does not maintain demonstration-only copies.
        </p>
      </header>

      <div id="controls-specimen-target" className="ds-controls-bench">
        <div className="ds-control-group">
          <h3>Actions</h3>
          <div className="ds-control-row">
            <Button>Primary</Button>
            <Button variant="outline">Secondary</Button>
            <Button variant="link">Tertiary</Button>
          </div>
          <CTAGroup
            actions={[
              { href: "#products", label: "Explore products" },
              {
                href: "#contact",
                label: "Build with us",
                variant: "outline",
              },
            ]}
          />
          <LanguageSwitch
            currentLocale="en"
            label="Language"
            localeLabels={{ pt: "PT", en: "EN" }}
          />
        </div>

        <div className="ds-control-group">
          <h3>States</h3>
          <div className="ds-control-row">
            <Button disabled>Disabled</Button>
            <Button disabled aria-busy="true">
              Loading…
            </Button>
            <Button aria-invalid="true" variant="outline">
              Invalid
            </Button>
          </div>
        </div>

        <div className="ds-control-group">
          <h3>Field</h3>
          <div className="ds-field">
            <Label htmlFor="design-system-email">Email</Label>
            <input
              className="ds-input"
              id="design-system-email"
              type="email"
              placeholder="name@domain.com"
            />
          </div>
        </div>

        <div className="ds-control-group">
          <h3>Sheet</h3>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Open sheet</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Production sheet</SheetTitle>
                <SheetDescription>
                  Keyboard focus, dismissal, and semantics come from the
                  production primitive.
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>

        <div className="ds-control-group">
          <h3>Assistive feedback</h3>
          <LiveRegion message="Status updates are announced here." />
          <SkipLink targetId="controls-specimen-target">
            Skip to controls demo
          </SkipLink>
        </div>

        <div className="ds-control-group ds-control-group--wide">
          <h3>Compact navigation</h3>
          <div
            className="ds-compact-navigation-preview"
            role="group"
            aria-label="Compact navigation at 320 pixels"
          >
            <CompactNavigationMenu
              activeSectionId="products"
              ariaLabel="Compact navigation"
              id="design-system-compact-navigation"
              links={[
                { label: "Products", sectionId: "products" },
                { label: "Open source", sectionId: "aegis" },
                { label: "Build with us", sectionId: "contact" },
              ]}
              open
            />
          </div>
          <p>
            The production menu is held at 320px so wrapping, touch targets,
            active location, and visible keyboard focus can be inspected.
          </p>
        </div>
      </div>
    </section>
  )
}

import { Menu, X } from "lucide-react"
import { type RefObject, useEffect, useRef, useState } from "react"

import { LanguageSwitch } from "@/components/landing/navigation/LanguageSwitch"
import { RetractableVoynanMark } from "@/components/landing/navigation/RetractableVoynanMark"
import { Button } from "@/components/ui/button"
import { sectionIds, type Locale, type SectionId } from "@/content/contracts"

type NavigationLink = {
  label: string
  sectionId: SectionId
}

type ProgressiveNavContent = {
  ariaLabel: string
  closeMenuLabel: string
  homeLabel: string
  languageLabel: string
  links: readonly NavigationLink[]
  localeLabels: Record<Locale, string>
  openMenuLabel: string
}

type ProgressiveNavProps = {
  content: ProgressiveNavContent
  currentLocale: Locale
}

type CompactNavigationMenuProps = {
  activeSectionId: SectionId
  ariaLabel: string
  firstLinkRef?: RefObject<HTMLAnchorElement | null>
  id: string
  links: readonly NavigationLink[]
  onNavigate?: () => void
  open: boolean
}

function getHashSectionId(hash: string): SectionId | undefined {
  const sectionId = hash.replace(/^#/, "") as SectionId
  return sectionIds.includes(sectionId) ? sectionId : undefined
}

export function CompactNavigationMenu({
  activeSectionId,
  ariaLabel,
  firstLinkRef,
  id,
  links,
  onNavigate,
  open,
}: CompactNavigationMenuProps) {
  return (
    <div id={id} className="landing-nav__compact" hidden={!open}>
      <nav aria-label={ariaLabel}>
        <ul>
          {links.map((link, index) => (
            <li key={link.sectionId}>
              <a
                ref={index === 0 ? firstLinkRef : undefined}
                href={`#${link.sectionId}`}
                aria-current={
                  activeSectionId === link.sectionId ? "location" : undefined
                }
                onClick={onNavigate}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export function ProgressiveNav({
  content,
  currentLocale,
}: ProgressiveNavProps) {
  const [activeSectionId, setActiveSectionId] = useState<SectionId>("hero")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuTriggerRef = useRef<HTMLButtonElement>(null)
  const firstCompactLinkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const sectionId = entry.target.id as SectionId

          if (sectionId === "hero") {
            const heroHasYielded =
              entry.boundingClientRect.top <=
              -entry.boundingClientRect.height * 0.7
            setIsCollapsed(heroHasYielded)
          }

          if (!entry.isIntersecting) continue

          if (sectionIds.includes(sectionId)) {
            setActiveSectionId(sectionId)
          }
        }
      },
      { rootMargin: "-20% 0px -55%", threshold: [0, 0.45, 1] },
    )

    document
      .querySelectorAll<HTMLElement>("main section[id]")
      .forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    function syncSectionFromHash() {
      const sectionId = getHashSectionId(window.location.hash)
      if (sectionId) setActiveSectionId(sectionId)
    }

    syncSectionFromHash()
    window.addEventListener("hashchange", syncSectionFromHash)
    return () => window.removeEventListener("hashchange", syncSectionFromHash)
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      firstCompactLinkRef.current?.focus()
    }
  }, [isMenuOpen])

  useEffect(() => {
    if (!isMenuOpen) return

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return
      setIsMenuOpen(false)
      menuTriggerRef.current?.focus()
    }

    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [isMenuOpen])

  const navigationLinks = content.links.map((link) => (
    <li key={link.sectionId}>
      <a
        href={`#${link.sectionId}`}
        aria-current={
          activeSectionId === link.sectionId ? "location" : undefined
        }
      >
        {link.label}
      </a>
    </li>
  ))

  return (
    <header className="landing-nav" data-collapsed={isCollapsed}>
      <div className="landing-nav__bar">
        <RetractableVoynanMark
          collapsed={isCollapsed}
          label={content.homeLabel}
        />

        <nav className="landing-nav__desktop" aria-label={content.ariaLabel}>
          <ul>{navigationLinks}</ul>
        </nav>

        <div className="landing-nav__desktop-language">
          <LanguageSwitch
            activeSectionId={activeSectionId}
            currentLocale={currentLocale}
            label={content.languageLabel}
            localeLabels={content.localeLabels}
          />
        </div>

        <Button
          ref={menuTriggerRef}
          className="landing-nav__menu-trigger hidden max-[980px]:inline-flex"
          type="button"
          variant="ghost"
          size="icon"
          aria-controls="compact-navigation"
          aria-expanded={isMenuOpen}
          aria-label={
            isMenuOpen ? content.closeMenuLabel : content.openMenuLabel
          }
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </Button>
      </div>

      <CompactNavigationMenu
        activeSectionId={activeSectionId}
        ariaLabel={content.ariaLabel}
        firstLinkRef={firstCompactLinkRef}
        id="compact-navigation"
        links={content.links}
        onNavigate={() => setIsMenuOpen(false)}
        open={isMenuOpen}
      />
    </header>
  )
}

export type {
  CompactNavigationMenuProps,
  ProgressiveNavContent,
  ProgressiveNavProps,
}

import { Menu, X } from "lucide-react"
import { type RefObject, useEffect, useRef, useState } from "react"

import { LanguageSwitch } from "@/components/landing/navigation/LanguageSwitch"
import { RetractableVoynanMark } from "@/components/landing/navigation/RetractableVoynanMark"
import { Button } from "@/components/ui/button"
import { sectionIds, type Locale, type SectionId } from "@/content/contracts"
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap"

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
  const [hasScrolled, setHasScrolled] = useState(false)
  const [footerReached, setFooterReached] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigationRef = useRef<HTMLElement>(null)
  const scrollProgressRef = useRef<HTMLSpanElement>(null)
  const menuTriggerRef = useRef<HTMLButtonElement>(null)
  const firstCompactLinkRef = useRef<HTMLAnchorElement>(null)

  useGSAP(
    () => {
      const scrollProgress = scrollProgressRef.current
      if (!scrollProgress) return

      gsap.set(scrollProgress, { scaleX: 0, transformOrigin: "left center" })

      const progressTrigger = ScrollTrigger.create({
        id: "navigation-scroll-progress",
        start: 0,
        end: "max",
        onUpdate: (trigger) => {
          const { progress } = trigger
          gsap.set(scrollProgress, { scaleX: progress })
          setHasScrolled(trigger.scroll() > 0)
        },
      })

      setHasScrolled(progressTrigger.scroll() > 0)

      const footer = document.querySelector<HTMLElement>(".atmospheric-footer")
      if (!footer) return

      const syncFooterState = (trigger: ScrollTrigger) => {
        setFooterReached(trigger.isActive)
      }
      const footerTrigger = ScrollTrigger.create({
        id: "navigation-footer-brand",
        trigger: footer,
        start: "top bottom",
        end: "bottom top",
        onRefresh: syncFooterState,
        onToggle: syncFooterState,
      })

      syncFooterState(footerTrigger)
    },
    { scope: navigationRef },
  )

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const sectionId = entry.target.id as SectionId

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
  const isBrandCollapsed = hasScrolled && footerReached

  return (
    <header
      ref={navigationRef}
      className="landing-nav"
      data-scrolled={hasScrolled}
      data-footer-reached={footerReached}
    >
      <div className="landing-nav__scroll-track" aria-hidden="true">
        <span
          ref={scrollProgressRef}
          className="landing-nav__scroll-progress"
        />
      </div>

      <div className="landing-nav__bar">
        <RetractableVoynanMark
          collapsed={isBrandCollapsed}
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

import { Menu, X } from "lucide-react"
import { type RefObject, useEffect, useRef, useState } from "react"

import { LanguageSwitch } from "@/components/landing/navigation/LanguageSwitch"
import { RetractableVoynanMark } from "@/components/landing/navigation/RetractableVoynanMark"
import { motionQueries } from "@/components/motion/motionQueries"
import { Button } from "@/components/ui/button"
import { sectionIds, type Locale, type SectionId } from "@/content/contracts"
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap"

const SECTION_INDEX_ID = "section-index-menu"

type NavigationLink = {
  label: string
  sectionId: SectionId
}

type ProgressiveNavContent = {
  ariaLabel: string
  homeLabel: string
  languageLabel: string
  links: readonly NavigationLink[]
  localeLabels: Record<Locale, string>
  menuLabel: string
}

type ProgressiveNavProps = {
  content: ProgressiveNavContent
  currentLocale: Locale
}

type SectionIndexMenuProps = {
  activeSectionId: SectionId
  ariaLabel?: string
  firstLinkRef?: RefObject<HTMLAnchorElement | null>
  id: string
  links: readonly NavigationLink[]
  onNavigate?: () => void
  open: boolean
  panelRef?: RefObject<HTMLDivElement | null>
}

function getHashSectionId(hash: string): SectionId | undefined {
  const sectionId = hash.replace(/^#/, "") as SectionId
  return sectionIds.includes(sectionId) ? sectionId : undefined
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false
  if (typeof window.matchMedia !== "function") return false
  return window.matchMedia(motionQueries.reduceMotion).matches
}

export function SectionIndexMenu({
  activeSectionId,
  ariaLabel,
  firstLinkRef,
  id,
  links,
  onNavigate,
  open,
  panelRef,
}: SectionIndexMenuProps) {
  return (
    <div ref={panelRef} id={id} className="landing-nav__index" hidden={!open}>
      <span
        className="landing-nav__index-sweep"
        data-index-sweep
        aria-hidden="true"
      />
      <div className="landing-nav__index-frame">
        <ul aria-label={ariaLabel}>
          {links.map((link, index) => (
            <li key={link.sectionId} data-index-row>
              <a
                ref={index === 0 ? firstLinkRef : undefined}
                href={`#${link.sectionId}`}
                aria-current={
                  activeSectionId === link.sectionId ? "location" : undefined
                }
                onClick={onNavigate}
              >
                <span
                  className="landing-nav__index-marker"
                  aria-hidden="true"
                />
                <span className="landing-nav__index-label">{link.label}</span>
                <span className="landing-nav__index-trace" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
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
  const indexPanelRef = useRef<HTMLDivElement>(null)
  const scrollProgressRef = useRef<HTMLSpanElement>(null)
  const menuTriggerRef = useRef<HTMLButtonElement>(null)
  const firstIndexLinkRef = useRef<HTMLAnchorElement>(null)

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

  useGSAP(
    () => {
      const panel = indexPanelRef.current
      if (!panel || !isMenuOpen || prefersReducedMotion()) return

      const select = gsap.utils.selector(panel)

      gsap
        .timeline()
        .fromTo(
          select("[data-index-sweep]"),
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.76,
            ease: "expo.out",
            transformOrigin: "left center",
          },
        )
        .fromTo(
          select("[data-index-row]"),
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "expo.out",
            stagger: 0.045,
          },
          0.06,
        )
    },
    {
      dependencies: [isMenuOpen],
      revertOnUpdate: true,
      scope: indexPanelRef,
    },
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
      firstIndexLinkRef.current?.focus()
    }
  }, [isMenuOpen])

  useEffect(() => {
    if (!isMenuOpen) return

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return
      setIsMenuOpen(false)
      menuTriggerRef.current?.focus()
    }

    function closeOnOutsidePointer(event: PointerEvent) {
      const navigation = navigationRef.current
      if (!navigation) return
      if (navigation.contains(event.target as Node)) return
      setIsMenuOpen(false)
    }

    window.addEventListener("keydown", closeOnEscape)
    document.addEventListener("pointerdown", closeOnOutsidePointer)
    return () => {
      window.removeEventListener("keydown", closeOnEscape)
      document.removeEventListener("pointerdown", closeOnOutsidePointer)
    }
  }, [isMenuOpen])

  const isBrandCollapsed = hasScrolled && footerReached

  return (
    <header
      ref={navigationRef}
      className="landing-nav"
      data-scrolled={hasScrolled}
      data-footer-reached={footerReached}
      data-menu-open={isMenuOpen}
      onBlur={(event) => {
        if (!isMenuOpen) return
        // Touch keyboards and iOS Safari drop focus without moving it, which
        // must not retract the index from under the finger mid-tap.
        if (!event.relatedTarget) return
        if (event.currentTarget.contains(event.relatedTarget)) return
        setIsMenuOpen(false)
      }}
    >
      <div className="landing-nav__scroll-track" aria-hidden="true">
        <span
          ref={scrollProgressRef}
          className="landing-nav__scroll-progress"
        />
      </div>

      <nav className="landing-nav__primary" aria-label={content.ariaLabel}>
        <div className="landing-nav__bar">
          <RetractableVoynanMark
            collapsed={isBrandCollapsed}
            label={content.homeLabel}
          />

          <div className="landing-nav__language">
            <LanguageSwitch
              activeSectionId={activeSectionId}
              currentLocale={currentLocale}
              label={content.languageLabel}
              localeLabels={content.localeLabels}
            />
          </div>

          <Button
            ref={menuTriggerRef}
            className="landing-nav__index-trigger"
            type="button"
            variant="outline"
            aria-controls={SECTION_INDEX_ID}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span className="landing-nav__index-trigger-label">
              {content.menuLabel}
            </span>
            {isMenuOpen ? (
              <X aria-hidden="true" />
            ) : (
              <Menu aria-hidden="true" />
            )}
          </Button>
        </div>

        <SectionIndexMenu
          activeSectionId={activeSectionId}
          firstLinkRef={firstIndexLinkRef}
          id={SECTION_INDEX_ID}
          links={content.links}
          onNavigate={() => setIsMenuOpen(false)}
          open={isMenuOpen}
          panelRef={indexPanelRef}
        />
      </nav>
    </header>
  )
}

export type {
  ProgressiveNavContent,
  ProgressiveNavProps,
  SectionIndexMenuProps,
}

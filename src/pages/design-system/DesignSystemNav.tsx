import { useEffect, useState } from "react"

import { foundationalSpecimens } from "@/pages/design-system/designSystemSpecimens"

export function DesignSystemNav() {
  const [activeSpecimen, setActiveSpecimen] =
    useState<(typeof foundationalSpecimens)[number]["id"]>("foundations")

  useEffect(() => {
    const updateActiveSpecimen = () => {
      const marker = window.scrollY + window.innerHeight * 0.4
      let current = foundationalSpecimens[0].id

      for (const specimen of foundationalSpecimens) {
        const section = document.getElementById(specimen.id)

        if (section && section.offsetTop <= marker) {
          current = specimen.id
        }
      }

      setActiveSpecimen(current)
    }

    window.addEventListener("scroll", updateActiveSpecimen, { passive: true })

    return () => window.removeEventListener("scroll", updateActiveSpecimen)
  }, [])

  return (
    <nav className="ds-nav" aria-label="Design system sections">
      <ol className="ds-nav__list">
        {foundationalSpecimens.map((specimen) => (
          <li key={specimen.id}>
            <a
              href={`#${specimen.id}`}
              aria-current={
                activeSpecimen === specimen.id ? "location" : undefined
              }
              onClick={() => setActiveSpecimen(specimen.id)}
            >
              {specimen.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

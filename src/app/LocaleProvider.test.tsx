// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest"

import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, expect, it, vi } from "vitest"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"

import { AppProviders } from "@/app/AppProviders"
import { useLocale } from "@/app/localeContext"
import { LOCALE_STORAGE_KEY } from "@/utils/locale"

function setPreferredLanguages(languages: readonly string[]) {
  Object.defineProperty(window.navigator, "languages", {
    configurable: true,
    value: languages,
  })
}

let mountCount = 0

function LocaleProbe() {
  const { locale, setLocale } = useLocale()
  const { t } = useTranslation()

  useEffect(() => {
    mountCount += 1
  }, [])

  return (
    <div>
      <p data-testid="locale">{locale}</p>
      <p data-testid="translated">{t("nav.language")}</p>
      <button type="button" onClick={() => setLocale("pt")}>
        Portuguese
      </button>
      <button type="button" onClick={() => setLocale("en")}>
        English
      </button>
    </div>
  )
}

beforeEach(() => {
  mountCount = 0
  window.localStorage.clear()
  window.history.replaceState(null, "", "/")
  setPreferredLanguages(["en-US"])
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

it("switches the rendered language in place without remounting consumers", async () => {
  const user = userEvent.setup()

  render(
    <AppProviders initialLocale="en">
      <LocaleProbe />
    </AppProviders>,
  )

  expect(screen.getByTestId("translated")).toHaveTextContent("Language")
  const mountsAfterFirstRender = mountCount

  await user.click(screen.getByRole("button", { name: "Portuguese" }))

  expect(screen.getByTestId("locale")).toHaveTextContent("pt")
  expect(screen.getByTestId("translated")).toHaveTextContent("Idioma")
  expect(mountCount).toBe(mountsAfterFirstRender)
})

it("records the choice in the document language, storage and the URL", async () => {
  const user = userEvent.setup()

  render(
    <AppProviders initialLocale="en">
      <LocaleProbe />
    </AppProviders>,
  )

  await user.click(screen.getByRole("button", { name: "Portuguese" }))

  expect(document.documentElement.lang).toBe("pt-BR")
  expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe("pt")
  expect(window.location.search).toBe("?lang=pt")

  await user.click(screen.getByRole("button", { name: "English" }))

  expect(document.documentElement.lang).toBe("en")
  expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe("en")
  expect(window.location.search).toBe("")
})

it("adopts a Portuguese browser preference on first visit", async () => {
  setPreferredLanguages(["pt-BR", "en"])

  render(
    <AppProviders initialLocale="en">
      <LocaleProbe />
    </AppProviders>,
  )

  expect(await screen.findByText("Idioma")).toBeVisible()
  expect(window.location.search).toBe("?lang=pt")
})

it("lets a stored preference win over the browser languages", async () => {
  window.localStorage.setItem(LOCALE_STORAGE_KEY, "en")
  setPreferredLanguages(["pt-BR"])

  render(
    <AppProviders initialLocale="en">
      <LocaleProbe />
    </AppProviders>,
  )

  expect(await screen.findByText("Language")).toBeVisible()
  expect(window.location.search).toBe("")
})

it("refuses to read the locale outside a provider", () => {
  const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})

  expect(() => render(<LocaleProbe />)).toThrow(/LocaleProvider/i)

  consoleError.mockRestore()
})

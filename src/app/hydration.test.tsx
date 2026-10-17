// @vitest-environment jsdom

import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router"
import { act } from "react"
import { hydrateRoot, type Root } from "react-dom/client"
import { renderToString } from "react-dom/server"
import { afterEach, expect, it } from "vitest"

import { createAppRouter } from "@/app/createAppRouter"
import { routeTree } from "@/routes/routeTree"

let hydrated: Root | undefined

afterEach(() => {
  act(() => hydrated?.unmount())
  hydrated = undefined
  document.body.innerHTML = ""
  window.localStorage.clear()
})

async function prerender(path: string) {
  // The same routes rendered the way the build prerenders them on the server.
  const serverRouter = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [path] }),
    isServer: true,
  })
  await serverRouter.load()

  return renderToString(<RouterProvider router={serverRouter} />)
}

it.each(["/", "/privacy"])(
  "hydrates the prerendered %s page without discarding the server HTML",
  async (path) => {
    const container = document.createElement("div")
    container.innerHTML = await prerender(path)
    document.body.append(container)
    window.history.replaceState(null, "", path)

    const clientRouter = createAppRouter(window.location.href, {
      hydrating: true,
    })
    await clientRouter.load()

    const hydrationErrors: unknown[] = []

    await act(async () => {
      hydrated = hydrateRoot(
        container,
        <RouterProvider router={clientRouter} />,
        {
          onRecoverableError: (error) => hydrationErrors.push(error),
        },
      )
    })

    expect(hydrationErrors).toEqual([])
  },
)

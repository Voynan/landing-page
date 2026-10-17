import {
  createBrowserHistory,
  createMemoryHistory,
  createRouter,
  type Router,
} from "@tanstack/react-router"

import { routeTree } from "@/routes/routeTree"

function toRelativeUrl(url: string) {
  const parsedUrl = new URL(url, "https://voynan.local")

  return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`
}

type CreateAppRouterOptions = {
  // True when the client takes over HTML that the build prerendered.
  hydrating?: boolean
}

export function createAppRouter(
  url: string,
  { hydrating = false }: CreateAppRouterOptions = {},
): Router<typeof routeTree> {
  const history =
    typeof window === "undefined"
      ? createMemoryHistory({ initialEntries: [toRelativeUrl(url)] })
      : createBrowserHistory()

  const router = createRouter({
    routeTree,
    history,
    defaultPreload: "intent",
  })

  // The router only renders its server-shaped tree, without the Suspense
  // boundary it wraps around client-only renders, once it knows it is
  // hydrating server output. TanStack Start sets this from its dehydrated
  // state; this app prerenders on its own, so it is set here. Without it the
  // client tree misses the prerendered HTML and React rebuilds every page.
  if (hydrating) router.ssr = { manifest: undefined }

  return router
}

export type AppRouter = ReturnType<typeof createAppRouter>

declare module "@tanstack/react-router" {
  interface Register {
    router: AppRouter
  }
}

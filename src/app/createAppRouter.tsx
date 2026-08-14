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

export function createAppRouter(url: string): Router<typeof routeTree> {
  const history =
    typeof window === "undefined"
      ? createMemoryHistory({ initialEntries: [toRelativeUrl(url)] })
      : createBrowserHistory()

  return createRouter({
    routeTree,
    history,
    defaultPreload: "intent",
  })
}

export type AppRouter = ReturnType<typeof createAppRouter>

declare module "@tanstack/react-router" {
  interface Register {
    router: AppRouter
  }
}

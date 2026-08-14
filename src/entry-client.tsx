import "@/styles/globals.css"

import { RouterProvider } from "@tanstack/react-router"
import { StrictMode } from "react"
import { createRoot, hydrateRoot } from "react-dom/client"

import { createAppRouter } from "@/app/createAppRouter"

async function hydrateApp() {
  const root = document.getElementById("root")

  if (!root) {
    throw new Error('Unable to hydrate: missing the element with id "root".')
  }

  const router = createAppRouter(window.location.href)
  await router.load()

  const app = (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  )

  if (root.hasChildNodes()) {
    hydrateRoot(root, app)
    return
  }

  createRoot(root).render(app)
}

void hydrateApp()

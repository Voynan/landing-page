import type { ReactNode } from "react"

import {
  ContactRuntimeContext,
  type ContactRuntimeValue,
} from "@/app/contactRuntimeContext"

type ContactRuntimeProviderProps = ContactRuntimeValue & {
  children: ReactNode
}

export function ContactRuntimeProvider({
  children,
  requestAntispamToken,
}: ContactRuntimeProviderProps) {
  return (
    <ContactRuntimeContext.Provider value={{ requestAntispamToken }}>
      {children}
    </ContactRuntimeContext.Provider>
  )
}

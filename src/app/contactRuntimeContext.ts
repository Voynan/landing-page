import { createContext, useContext } from "react"

export type AntispamTokenAdapter = () => Promise<string>

export type ContactRuntimeValue = {
  requestAntispamToken?: AntispamTokenAdapter
}

export const ContactRuntimeContext = createContext<ContactRuntimeValue>({})

export function useContactRuntime() {
  return useContext(ContactRuntimeContext)
}

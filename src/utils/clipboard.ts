type ClipboardWriter = {
  writeText(text: string): Promise<void>
}

export type CopyTextResult = "copied" | "manual"

export async function copyText(
  text: string,
  clipboard: ClipboardWriter | null | undefined = globalThis.navigator
    ?.clipboard,
): Promise<CopyTextResult> {
  if (!clipboard?.writeText) return "manual"

  try {
    await clipboard.writeText(text)
    return "copied"
  } catch {
    return "manual"
  }
}

export type { ClipboardWriter }

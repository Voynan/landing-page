import axios, { type AxiosInstance } from "axios"

import { publicConfig } from "@/config/publicConfig"
import {
  contactInputSchema,
  contactSubmissionResultSchema,
  contactSubmissionSchema,
  type ContactInput,
  type ContactSubmissionResult,
} from "@/schemas/contact"
import { apiClient, createApiClient } from "@/lib/apiClient"

export type ContactError = "validation" | "timeout" | "rejected" | "network"

export class ContactSubmissionError extends Error {
  readonly kind: ContactError

  constructor(kind: ContactError) {
    super("Contact submission failed")
    this.name = "ContactSubmissionError"
    this.kind = kind
  }
}

type SubmitContactOptions = {
  endpoint?: string
  timeout?: number
  client?: AxiosInstance
}

function normalizeContactError(error: unknown): ContactSubmissionError {
  if (error instanceof ContactSubmissionError) return error

  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return new ContactSubmissionError("timeout")
    }

    if (error.response) {
      const status = error.response.status
      return new ContactSubmissionError(
        status === 400 || status === 422 ? "validation" : "rejected",
      )
    }

    return new ContactSubmissionError("network")
  }

  return new ContactSubmissionError("network")
}

export async function submitContact(
  input: ContactInput,
  antispamToken: string,
  options: SubmitContactOptions = {},
): Promise<ContactSubmissionResult> {
  const endpoint = options.endpoint ?? publicConfig.contactEndpoint

  if (!endpoint) throw new ContactSubmissionError("rejected")

  const parsedInput = contactInputSchema.safeParse(input)
  const parsedSubmission = contactSubmissionSchema.safeParse({
    ...(parsedInput.success ? parsedInput.data : input),
    antispamToken,
  })

  if (!parsedSubmission.success) {
    throw new ContactSubmissionError("validation")
  }

  const client =
    options.client ??
    (options.timeout === undefined
      ? apiClient
      : createApiClient(options.timeout))

  try {
    const response = await client.post(endpoint, parsedSubmission.data)
    const parsedResponse = contactSubmissionResultSchema.safeParse(
      response.data,
    )

    if (!parsedResponse.success) {
      throw new ContactSubmissionError("rejected")
    }

    return parsedResponse.data
  } catch (error) {
    throw normalizeContactError(error)
  }
}

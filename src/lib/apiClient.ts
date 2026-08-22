import axios from "axios"

export const contactRequestTimeout = 10_000

export function createApiClient(timeout = contactRequestTimeout) {
  return axios.create({
    timeout,
    headers: { "Content-Type": "application/json" },
  })
}

export const apiClient = createApiClient()

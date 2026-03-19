import { bandsApiEnvironment, getAccessToken } from "@/lib/keycloak"

type RequestOptions = RequestInit & {
  headers?: HeadersInit
}

function buildUrl(input: string) {
  const baseUrl = bandsApiEnvironment.baseUrl || "https://bands-api.staging.wband.ru"
  const incomingUrl = new URL(input)
  const runtimeBaseUrl = new URL(baseUrl)

  return new URL(`${incomingUrl.pathname}${incomingUrl.search}`, runtimeBaseUrl).toString()
}

async function buildHeaders(headers?: HeadersInit) {
  const requestHeaders = new Headers(headers)
  const token = await getAccessToken()

  if (!token) {
    throw new Error("Bands API requires an authenticated Keycloak session")
  }

  requestHeaders.set("Authorization", `Bearer ${token}`)

  if (!requestHeaders.has("Accept")) {
    requestHeaders.set("Accept", "application/json")
  }

  return requestHeaders
}

async function parseResponse<T>(response: Response) {
  if (response.status === 204) {
    return undefined as T
  }

  const contentType = response.headers.get("content-type") ?? ""

  if (contentType.includes("application/json")) {
    return (await response.json()) as T
  }

  return (await response.text()) as T
}

export async function customFetch<T>(url: string, options: RequestOptions = {}) {
  const response = await fetch(buildUrl(url), {
    ...options,
    headers: await buildHeaders(options.headers),
  })

  if (!response.ok) {
    const payload = await parseResponse<unknown>(response)
    const message =
      typeof payload === "object" &&
      payload !== null &&
      "message" in payload &&
      typeof payload.message === "string"
        ? payload.message
        : `Bands API request failed with status ${response.status}`

    throw new Error(message)
  }

  return parseResponse<T>(response)
}

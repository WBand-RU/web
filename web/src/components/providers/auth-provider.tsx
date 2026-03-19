import * as React from "react"
import { ReactKeycloakProvider, useKeycloak } from "@react-keycloak/web"

import { TooltipProvider } from "@/components/ui/tooltip"
import { isKeycloakConfigured, keycloak } from "@/lib/keycloak"

type AuthProfile = {
  name: string
  email: string
  initials: string
}

type AuthContextValue = {
  configured: boolean
  initialized: boolean
  authenticated: boolean
  profile: AuthProfile | null
  login: (redirectTo?: string) => void
  logout: () => void
}

const defaultValue: AuthContextValue = {
  configured: false,
  initialized: true,
  authenticated: false,
  profile: null,
  login: () => undefined,
  logout: () => undefined,
}

const AuthContext = React.createContext<AuthContextValue>(defaultValue)

function buildProfile(tokenParsed: Record<string, unknown> | undefined): AuthProfile | null {
  if (!tokenParsed) {
    return null
  }

  const name =
    (typeof tokenParsed.name === "string" && tokenParsed.name) ||
    (typeof tokenParsed.preferred_username === "string" && tokenParsed.preferred_username) ||
    (typeof tokenParsed.email === "string" && tokenParsed.email) ||
    "Музыкант"

  const email =
    (typeof tokenParsed.email === "string" && tokenParsed.email) || "account@keycloak.local"

  const initials = name
    .split(" ")
    .map((part) => part.trim()[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return {
    name,
    email,
    initials: initials || "WB",
  }
}

function KeycloakBridge({ children }: React.PropsWithChildren) {
  const { keycloak: authClient, initialized } = useKeycloak()

  const value = React.useMemo<AuthContextValue>(() => {
    const tokenParsed = authClient.tokenParsed as Record<string, unknown> | undefined

    return {
      configured: true,
      initialized,
      authenticated: Boolean(authClient.authenticated),
      profile: buildProfile(tokenParsed),
      login: (redirectTo) => {
        void authClient.login({
          redirectUri: redirectTo ?? window.location.href,
        })
      },
      logout: () => {
        void authClient.logout({
          redirectUri: `${window.location.origin}/`,
        })
      },
    }
  }, [authClient, initialized])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function AuthProvider({ children }: React.PropsWithChildren) {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <TooltipProvider>
        {isKeycloakConfigured && keycloak ? (
          <ReactKeycloakProvider
            authClient={keycloak}
            initOptions={{
              onLoad: "check-sso",
              pkceMethod: "S256",
              checkLoginIframe: false,
            }}
          >
            <KeycloakBridge>{children}</KeycloakBridge>
          </ReactKeycloakProvider>
        ) : (
          <AuthContext.Provider value={defaultValue}>{children}</AuthContext.Provider>
        )}
      </TooltipProvider>
    </div>
  )
}

export function useAuth() {
  return React.useContext(AuthContext)
}

import * as React from "react"
import { Outlet, useLocation } from "react-router-dom"

import {
  AuthConfigurationRequiredState,
  AuthLoadingState,
} from "@/components/auth/auth-states"
import { useAuth } from "@/components/providers/auth-provider"

export function ProtectedRoute() {
  const auth = useAuth()
  const location = useLocation()
  const loginTriggeredRef = React.useRef(false)

  React.useEffect(() => {
    if (
      auth.configured &&
      auth.initialized &&
      !auth.authenticated &&
      !loginTriggeredRef.current
    ) {
      loginTriggeredRef.current = true
      auth.login(`${window.location.origin}${location.pathname}${location.search}${location.hash}`)
    }
  }, [auth, location.hash, location.pathname, location.search])

  if (!auth.configured) {
    return <AuthConfigurationRequiredState />
  }

  if (!auth.initialized || !auth.authenticated) {
    return <AuthLoadingState />
  }

  return <Outlet />
}

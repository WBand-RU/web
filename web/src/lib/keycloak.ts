import Keycloak from "keycloak-js";

type RuntimeEnv = {
  VITE_KEYCLOAK_URL?: string;
  VITE_KEYCLOAK_REALM?: string;
  VITE_KEYCLOAK_CLIENT_ID?: string;
  VITE_BANDS_API_URL?: string;
};

declare global {
  interface Window {
    __ENV__?: RuntimeEnv;
  }
}

const runtimeEnv: RuntimeEnv =
  typeof window !== "undefined" && typeof window.__ENV__ === "object"
    ? (window.__ENV__ ?? {})
    : {};

const url = runtimeEnv.VITE_KEYCLOAK_URL ?? import.meta.env.VITE_KEYCLOAK_URL;
const realm =
  runtimeEnv.VITE_KEYCLOAK_REALM ?? import.meta.env.VITE_KEYCLOAK_REALM;
const clientId =
  runtimeEnv.VITE_KEYCLOAK_CLIENT_ID ?? import.meta.env.VITE_KEYCLOAK_CLIENT_ID;
const bandsApiUrl =
  runtimeEnv.VITE_BANDS_API_URL ?? import.meta.env.VITE_BANDS_API_URL;

export const isKeycloakConfigured = Boolean(url && realm && clientId);

export const keycloak = isKeycloakConfigured
  ? new Keycloak({
      url,
      realm,
      clientId,
    })
  : null;

export const keycloakEnvironment = {
  url: url ?? "",
  realm: realm ?? "",
  clientId: clientId ?? "",
};

export const bandsApiEnvironment = {
  baseUrl: bandsApiUrl ?? "https://bands-api.staging.wband.ru",
};

export async function getAccessToken() {
  if (!keycloak?.authenticated || !keycloak.token) {
    return null;
  }

  try {
    await keycloak.updateToken(30);
  } catch {
    return null;
  }

  return keycloak.token ?? null;
}


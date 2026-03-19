import Keycloak from "keycloak-js";

const url = import.meta.env.VITE_KEYCLOAK_URL;
const realm = import.meta.env.VITE_KEYCLOAK_REALM;
const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID;
const bandsApiUrl = import.meta.env.VITE_BANDS_API_URL;

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


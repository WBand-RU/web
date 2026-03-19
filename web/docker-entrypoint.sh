#!/bin/sh
set -e

# Render environment variables into a JS config consumed by the app at runtime.
TEMPLATE=/usr/share/nginx/html/env.template.js
OUTPUT=/usr/share/nginx/html/env.js

# Create template if not already present (for local builds without assets present yet)
if [ ! -f "$TEMPLATE" ]; then
  cat > "$TEMPLATE" <<'EOF'
window.__ENV__ = {
  VITE_KEYCLOAK_URL: "${VITE_KEYCLOAK_URL}",
  VITE_KEYCLOAK_REALM: "${VITE_KEYCLOAK_REALM}",
  VITE_KEYCLOAK_CLIENT_ID: "${VITE_KEYCLOAK_CLIENT_ID}",
  VITE_BANDS_API_URL: "${VITE_BANDS_API_URL}",
};
EOF
fi

envsubst < "$TEMPLATE" > "$OUTPUT"
exec "$@"

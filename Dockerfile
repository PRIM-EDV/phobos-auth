#-----------------------
# Base image layer
#-----------------------
FROM node:24.1.0-slim AS base

# ----------------------
# Package.json layer
# ----------------------
FROM base AS package.json
RUN apt-get update && apt-get install -y jq

WORKDIR /opt/phobos-auth

COPY package.json ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/frontend/package.json ./apps/frontend/

RUN jq 'del(.version)' package.json > package.json.slim && mv package.json.slim package.json
RUN jq 'del(.version)' apps/backend/package.json > apps/backend/package.json.slim && mv apps/backend/package.json.slim apps/backend/package.json
RUN jq 'del(.version)' apps/frontend/package.json > apps/frontend/package.json.slim && mv apps/frontend/package.json.slim apps/frontend/package.json

# ----------------------
# Base dependencies layer
# ----------------------
FROM base AS deps
RUN apt update && apt install python3 build-essential protobuf-compiler -y

WORKDIR /opt/phobos-auth

COPY --from=package.json /opt/phobos-auth ./

COPY lerna*.json ./
COPY libs ./libs

RUN npm install

# ----------------------
# Frontend build
# ----------------------
FROM deps AS frontend
COPY apps/frontend ./apps/frontend
RUN npx lerna run build --scope @phobos-auth/frontend --include-dependencies

# ----------------------
# Backend build
# ----------------------
FROM deps AS backend
COPY apps/backend ./apps/backend
RUN npx lerna run build --scope @phobos-auth/backend --include-dependencies

# ----------------------
# Image
# ----------------------
FROM backend

WORKDIR /opt/phobos-auth
COPY --from=frontend /opt/phobos-auth/apps/frontend/dist/phobos-auth/browser ./apps/backend/dist/public

# Run startscript
COPY ./docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

CMD ["./docker-entrypoint.sh"]
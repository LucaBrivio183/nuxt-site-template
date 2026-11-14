# syntax=docker/dockerfile:1
# static site, nuxt generate served by unprivileged nginx on port 8080

ARG NODE_IMAGE=node:26.13-alpine
ARG NGINX_IMAGE=nginxinc/nginx-unprivileged:1.30-alpine

FROM ${NODE_IMAGE} AS build
ARG PNPM_VERSION=12.18.0
RUN npm install -g pnpm@${PNPM_VERSION}
WORKDIR /app

# fetch dependencies from the lockfile only, so this layer survives source edits
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm fetch --store-dir /pnpm/store

COPY . .
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --offline --frozen-lockfile --store-dir /pnpm/store

# site url and deploy environment are baked into the generated html
ARG NUXT_SITE_URL=https://example.com
ARG NUXT_SITE_ENV=production
ENV NUXT_SITE_URL=${NUXT_SITE_URL} \
    NUXT_SITE_ENV=${NUXT_SITE_ENV} \
    NUXT_TELEMETRY_DISABLED=1
RUN pnpm generate

FROM ${NGINX_IMAGE}
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/.output/public /usr/share/nginx/html
USER 101
EXPOSE 8080

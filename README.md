# nuxt-site-template

The starting point for every site on Luca's self-hosted platform. A site created from this
template is a Nuxt 4 app that GitHub Actions builds into a Docker image, publishes to the
GitHub Container Registry (GHCR), and hands to Coolify. Nothing is ever built on the server.

## Versions

Pinned on 2026-11-14 after checking npm and nodejs.org.

| Tool | Version | Where it is pinned |
| --- | --- | --- |
| Node.js | 26.13.1 LTS "Lithium" | `.nvmrc`, `engines` in `package.json`, `node:26.13-alpine` in the Dockerfiles |
| pnpm | 12.18.0 | `packageManager` in `package.json`, `PNPM_VERSION` in the Dockerfiles |
| Nuxt | 4.6.4 | `package.json` |
| Nuxt UI | 4.12.0, with Tailwind CSS 4.3.5 | `package.json` |
| TypeScript | 6.0.3 | `package.json` |

TypeScript stays on 6.x: `vue-tsc` (through Volar) needs TypeScript below 7, and
`typescript-eslint` needs below 6.1. Move to 7 when both support it.

Node 26 no longer ships Corepack, so install pnpm directly:

```bash
npm install -g pnpm@12.18.0
```

## What is included

- **Nuxt 4** with TypeScript and the `app/` directory layout.
- **Nuxt UI 4** on **Tailwind CSS 4**, with the Lucide icon set bundled locally.
- **motion-v** (Motion for Vue) for animation, registered through `motion-v/nuxt`.
- **@nuxt/image** and **@nuxt/fonts**. Fonts are downloaded at build time and served from the site itself.
- **@nuxtjs/seo**: sitemap, robots.txt, meta tags and Schema.org. OG image generation is off until a site installs a renderer.
- **ESLint** through `@nuxt/eslint`, type-checking through `nuxt typecheck`, and **Vitest** with `@nuxt/test-utils`.
- Two runtime images: `Dockerfile` (static) and `Dockerfile.ssr` (server-rendered).
- `.github/workflows/deploy.yml`, which checks, builds, publishes and deploys.
- A `/playground` page, the living gallery of reusable snippets.

## Start a new site

1. Create the repository from the template. Choose public or private before you run it, see
   [Plan limits](#plan-limits).

   ```bash
   gh repo create LucaBrivio183/<site> --template LucaBrivio183/nuxt-site-template --public --clone
   ```

2. Install and run it.

   ```bash
   nvm use
   pnpm install
   pnpm dev
   ```

3. Set the site's name and description in `site` inside `nuxt.config.ts`. The site URL comes
   from the `SITE_URL` variable at build time, so leave the placeholder there.
4. Replace `app/pages/index.vue` with the site's content. Delete `app/pages/playground.vue`
   unless the site should publish its own gallery.
5. Create the branches the site needs (`wireframe`, `stage`, `main`), set the variables and
   secrets below, and connect each deploy environment to Coolify.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Development server on http://localhost:3000 |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `vue-tsc` through `nuxt typecheck` |
| `pnpm test` | Vitest, once |
| `pnpm build` | Server build in `.output/` |
| `pnpm generate` | Static build in `.output/public/` |

## Render modes

The repository variable `RENDER_MODE` picks the Dockerfile the workflow builds.

| `RENDER_MODE` | Dockerfile | Runtime | Port | Use it for |
| --- | --- | --- | --- | --- |
| `static` (default) | `Dockerfile` | `nginxinc/nginx-unprivileged:1.30-alpine`, user 101 | 8080 | Showcase sites |
| `ssr` | `Dockerfile.ssr` | `node:26.13-alpine` running `.output/server/index.mjs`, user `node` | 3000 | Shops, accounts, content that changes per request |

Both images build with `pnpm fetch` and an offline install, so the dependency layer is
reused until `pnpm-lock.yaml` changes.

The static image serves prerendered pages first and falls back to `200.html` for client-side
routes. As a consequence an unknown URL answers 200 and shows the 404 page in the browser.
Search engines treat that as a soft 404. If that matters for a site, use `ssr`, or change the
last `try_files` entry in `docker/nginx.conf` to `=404`.

Measured locally on 2026-11-14 with this template's pages:

| Image | Size | Memory after start |
| --- | --- | --- |
| static | 61 MB | 11 MiB |
| ssr | 209 MB | 57 MiB |

## Deploy pipeline

Every push to `wireframe`, `stage` or `main` runs `.github/workflows/deploy.yml`:

1. **check**: `pnpm install --frozen-lockfile`, then lint, type-check and test.
2. **image**: build the Dockerfile chosen by `RENDER_MODE`, then push it to
   `ghcr.io/lucabrivio183/<repo>` with two tags, the branch name and the full commit SHA.
   The default `GITHUB_TOKEN` pushes the image, so no registry secret is needed. Layers are
   cached in the GitHub Actions cache.
3. **deploy**: if the environment has both `COOLIFY_WEBHOOK_URL` and `COOLIFY_TOKEN`, call
   the Coolify deploy webhook. Coolify then pulls the branch tag again and restarts the app.
   Without them the step logs a notice and succeeds.

| Branch | GitHub environment | `NUXT_SITE_ENV` | Indexed by search engines |
| --- | --- | --- | --- |
| `wireframe` | `wireframe` | `wireframe` | No |
| `stage` | `stage` | `stage` | No |
| `main` | `prod` | `production` | Yes |

Only `production` is indexable. The other environments get `Disallow: /` in robots.txt and
a `noindex` meta tag.

Image visibility follows the repository in practice. On 2026-11-14 the image pushed from this
public template could be pulled anonymously, so it is public. GitHub documents new packages as
private by default, which is what a private site repository gets. The server pulls private
images with the token saved under Coolify's Registries, see below.

## Variables and secrets

None of these live in the repository. Set them with `gh` from inside the site's clone.

| Name | Kind | Scope | Value |
| --- | --- | --- | --- |
| `RENDER_MODE` | variable | repository | `static` or `ssr`. Unset means `static`. |
| `SITE_URL` | variable | each environment | The public URL of that environment, for example `https://stage.example.com` |
| `COOLIFY_WEBHOOK_URL` | secret | each environment | `https://coolify.chiperset.com/api/v1/deploy?uuid=<app-uuid>&force=false` |
| `COOLIFY_TOKEN` | secret | each environment | A Coolify API token with only the `deploy` ability |

```bash
gh variable set RENDER_MODE --body static
gh variable set SITE_URL --env prod --body https://example.com
gh secret set COOLIFY_WEBHOOK_URL --env prod
gh secret set COOLIFY_TOKEN --env prod
```

`gh secret set` without `--body` prompts for the value, so it never lands in shell history.
GitHub creates each environment on the first workflow run that uses it.

### Plan limits

On GitHub Free, environments, environment variables and environment secrets work only in
public repositories. A private site repository on Free cannot hold per-environment secrets,
so the deploy step would always skip. For a private site, either use a paid plan or make the
repository public. The secrets stay secret in a public repository.

## Connect a site to Coolify

Once per server, add the registry: **Settings → Registries** (Docker Registries) with
`ghcr.io`, the GitHub username, and a personal access token (classic) with only
`read:packages`. GHCR does not accept fine-grained tokens.

Then, for each site:

1. Create a **Project** named after the site, with one **Environment** per deploy environment:
   `wireframe`, `stage`, `prod`.
2. In each environment, add a resource of type **Docker Image** with the image
   `ghcr.io/lucabrivio183/<repo>:<branch>`, for example `:main` in `prod`.
3. Set the exposed port to `8080` for `static`, or `3000` for `ssr`.
4. Set the domain: the site's domain in `prod`, `stage.<domain>` and `wireframe.<domain>` in
   the others.
5. For `ssr` only, set `NUXT_SITE_URL` and `NUXT_SITE_ENV` as runtime variables in Coolify.
   For `static` they are baked in at build time from `SITE_URL`.
6. Copy the app's deploy webhook URL into `COOLIFY_WEBHOOK_URL` of the matching GitHub
   environment, and a `deploy`-only token for that environment into `COOLIFY_TOKEN`.

## Playground

`/playground` renders every component in `app/components/playground/`, sorted by file name.
To add a snippet, create one `.vue` file there; the page picks it up with no registration.
The section title comes from the file name, so `PricingTable.vue` shows as "Pricing table".

## Shared code across sites

Components are copied from the playground into a site. A shared Nuxt Layer
(`nuxt-base-layer`, which sites would `extends`) is extracted only when a second site
reuses a component. Until then there is no layer.

## Licence

MIT, see `LICENSE`.

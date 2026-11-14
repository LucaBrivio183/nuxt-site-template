<script setup lang="ts">
useSeoMeta({
  title: 'Home',
  description: 'A Nuxt 4 starting point that ships every site as a Docker image.',
})

const stack = [
  { name: 'Nuxt 4', role: 'Framework, TypeScript, file-based routing' },
  { name: 'Nuxt UI 4 and Tailwind CSS 4', role: 'Components and styling' },
  { name: 'motion-v', role: 'Animation for Vue' },
  { name: 'Nuxt Image and Nuxt Fonts', role: 'Optimised images and self-hosted fonts' },
  { name: 'Nuxt SEO', role: 'Sitemap, robots, meta tags, Schema.org' },
]

const pipeline = [
  'Push to wireframe, stage or main.',
  'GitHub Actions lints, type-checks, tests and builds the Docker image.',
  'The image is published to GitHub Container Registry with the branch and commit tags.',
  'Coolify is told to pull the new image and restart the site.',
]
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
    <section class="max-w-3xl">
      <h1 class="font-display text-4xl font-semibold leading-tight tracking-tight text-balance sm:text-6xl">
        Start a site here, ship it as a Docker image.
      </h1>
      <p class="mt-6 max-w-2xl text-lg text-muted">
        This template is the starting point for every site on the platform. Replace this page
        with the site's content, keep the pipeline.
      </p>
      <div class="mt-8 flex flex-wrap gap-3">
        <UButton
          to="/playground"
          label="Open the playground"
          size="lg"
        />
        <UButton
          to="https://github.com/LucaBrivio183/nuxt-site-template"
          target="_blank"
          label="View the source"
          size="lg"
          color="neutral"
          variant="outline"
        />
      </div>
    </section>

    <div class="mt-20 grid gap-12 md:grid-cols-2">
      <section aria-labelledby="stack-heading">
        <h2
          id="stack-heading"
          class="font-display text-2xl font-semibold"
        >
          What is included
        </h2>
        <dl class="mt-6 divide-y divide-default">
          <div
            v-for="item in stack"
            :key="item.name"
            class="py-3"
          >
            <dt class="font-medium">
              {{ item.name }}
            </dt>
            <dd class="text-muted">
              {{ item.role }}
            </dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="pipeline-heading">
        <h2
          id="pipeline-heading"
          class="font-display text-2xl font-semibold"
        >
          How a change goes live
        </h2>
        <ol class="mt-6 space-y-4">
          <li
            v-for="(step, index) in pipeline"
            :key="step"
            class="flex gap-4"
          >
            <span
              class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display font-semibold text-primary"
              aria-hidden="true"
            >{{ index + 1 }}</span>
            <span class="pt-1">{{ step }}</span>
          </li>
        </ol>
      </section>
    </div>
  </div>
</template>

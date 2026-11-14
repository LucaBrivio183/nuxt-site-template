<script setup lang="ts">
import type { Component } from 'vue'

useSeoMeta({
  title: 'Playground',
  description: 'A living gallery of components and snippets to reuse across sites.',
})

// every .vue file in app/components/playground shows up here, no registration needed
const snippets = collectSnippets(
  import.meta.glob<{ default: Component }>('../components/playground/*.vue', { eager: true }),
)
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6">
    <header class="max-w-2xl">
      <h1 class="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
        Playground
      </h1>
      <p class="mt-4 text-lg text-muted">
        Components worth reusing. Add one by creating a file in
        <code class="rounded bg-elevated px-1.5 py-0.5 text-sm">app/components/playground/</code>.
      </p>
      <nav
        class="mt-6 flex flex-wrap gap-2"
        aria-label="Snippets"
      >
        <UButton
          v-for="snippet in snippets"
          :key="snippet.id"
          :to="`#${snippet.id}`"
          :label="snippet.title"
          color="neutral"
          variant="soft"
          size="sm"
        />
      </nav>
    </header>

    <div class="mt-12 space-y-16">
      <section
        v-for="snippet in snippets"
        :id="snippet.id"
        :key="snippet.id"
        :aria-labelledby="`${snippet.id}-title`"
        class="scroll-mt-8"
      >
        <div class="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h2
            :id="`${snippet.id}-title`"
            class="font-display text-xl font-semibold"
          >
            {{ snippet.title }}
          </h2>
          <code class="break-all text-sm text-muted">{{ snippet.path }}</code>
        </div>
        <div class="overflow-hidden rounded-xl border border-default bg-default">
          <component :is="snippet.component" />
        </div>
      </section>
    </div>
  </div>
</template>

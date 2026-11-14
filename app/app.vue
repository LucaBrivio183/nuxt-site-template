<script setup lang="ts">
import { MotionConfig } from 'motion-v'

const links = [
  { label: 'Home', to: '/' },
  { label: 'Playground', to: '/playground' },
]
</script>

<template>
  <UApp>
    <MotionConfig reduced-motion="user">
      <header class="border-b border-default">
        <nav
          class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6"
          aria-label="Main"
        >
          <NuxtLink
            to="/"
            class="font-display text-lg font-semibold tracking-tight"
          >
            nuxt-site-template
          </NuxtLink>
          <div class="flex items-center gap-1">
            <UButton
              v-for="link in links"
              :key="link.to"
              :to="link.to"
              :label="link.label"
              variant="ghost"
              color="neutral"
              active-color="primary"
            />
            <UColorModeButton />
          </div>
        </nav>
      </header>
      <main>
        <NuxtPage />
      </main>
    </MotionConfig>
  </UApp>
</template>

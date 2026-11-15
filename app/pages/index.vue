<script setup lang="ts">
useSeoMeta({ title: 'Home' })

const steps = [
  'Set the site name in nuxt.config.ts.',
  'Replace app/pages/index.vue with the site content.',
  'Connect the deploy environment to Coolify.',
]
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 py-12 sm:px-6">
    <h1 class="font-display text-3xl font-semibold tracking-tight">
      Next steps
    </h1>
    <ol class="mt-6 list-decimal space-y-2 pl-5">
      <li
        v-for="step in steps"
        :key="step"
      >
        {{ step }}
      </li>
    </ol>
  </div>
</template>
